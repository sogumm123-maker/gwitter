# 설정 가이드

지금 이 폴더의 `index.html`을 그냥 열어도 **데모 모드**로 동작해요 (이 브라우저에만 저장됨).
친구들과 실제로 공유하려면 아래 3단계를 따라 하세요. 완전 무료입니다.

## 1. Supabase 프로젝트 만들기

1. https://supabase.com 에서 회원가입 후 "New project" 생성 (리전은 Northeast Asia (Seoul) 추천)
2. 프로젝트가 만들어지면 왼쪽 메뉴 **SQL Editor** 클릭

## 2. 테이블/보안 규칙 만들기

SQL Editor에 아래 전체를 붙여넣고 실행(Run)하세요.
`'여기에원하는비밀번호'` 부분을 본인이 기억할 비밀번호로 바꿔주세요. 이게 나중에 프로필을 수정하거나 방명록 글을 지울 때 쓰는 비밀번호예요.

```sql
create extension if not exists pgcrypto;

create table profile (
  id int primary key default 1,
  name text not null default '이름을 입력하세요',
  handle text not null default 'username',
  bio text default '',
  location text default '',
  joined_label text default '',
  avatar_url text default '',
  cover_url text default '',
  passcode_hash text not null,
  constraint single_row check (id = 1)
);

insert into profile (id, name, handle, bio, passcode_hash)
values (1, '이름을 입력하세요', 'username', '자기소개를 입력하세요',
        crypt('여기에원하는비밀번호', gen_salt('bf')));

create table guestbook (
  id bigint generated always as identity primary key,
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table profile enable row level security;
alter table guestbook enable row level security;

create policy "profile is publicly readable" on profile
  for select using (true);

create policy "guestbook is publicly readable" on guestbook
  for select using (true);

create policy "anyone can write a guestbook entry" on guestbook
  for insert with check (
    char_length(name) between 1 and 40
    and char_length(message) between 1 and 280
  );

create or replace function update_profile(
  p_name text, p_handle text, p_bio text, p_location text,
  p_avatar_url text, p_cover_url text, p_joined_label text, p_passcode text
) returns boolean
language plpgsql security definer as $$
declare ok boolean;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into ok
  from profile where id = 1;

  if not coalesce(ok, false) then
    return false;
  end if;

  update profile set
    name = p_name, handle = p_handle, bio = p_bio, location = p_location,
    avatar_url = p_avatar_url, cover_url = p_cover_url, joined_label = p_joined_label
  where id = 1;

  return true;
end;
$$;

create or replace function delete_guestbook_entry(p_id bigint, p_passcode text)
returns boolean
language plpgsql security definer as $$
declare ok boolean;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into ok
  from profile where id = 1;

  if not coalesce(ok, false) then
    return false;
  end if;

  delete from guestbook where id = p_id;
  return true;
end;
$$;

grant execute on function update_profile to anon;
grant execute on function delete_guestbook_entry to anon;
```

> 참고: `guestbook` 테이블에는 수정/삭제 정책을 만들지 않았기 때문에, 방문자는 글을 남길 수만 있고
> 남의 글을 고치거나 지울 수는 없어요. 삭제는 위에서 만든 `delete_guestbook_entry` 함수(비밀번호 필요)로만 가능합니다.
> 다만 이 방식은 은행 수준의 보안은 아니에요 — 가벼운 개인 홈페이지용 방명록 정도로 생각해주세요.

## 3. `config.js`에 연결 정보 붙여넣기

Supabase 프로젝트 화면에서 **Project Settings → API**로 이동하면:
- **Project URL** → `config.js`의 `SUPABASE_URL`
- **anon public** 키 → `config.js`의 `SUPABASE_ANON_KEY`

`config.js`를 열어 아래처럼 채워주세요.

```js
const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

저장 후 `index.html`을 다시 열면 데모 배너가 사라지고 실제 Supabase에 연결돼요.
이제 우측 상단 "프로필 편집"에서 2번 단계에서 설정한 비밀번호로 이름/소개/사진 등을 입력하면 됩니다.

## 4. 친구들과 공유할 링크 만들기 (배포)

폴더 전체(`index.html`, `style.css`, `app.js`, `config.js`)를 아래 중 아무 곳에나 올리면 링크가 생겨요. 전부 무료입니다.

**가장 쉬운 방법 — Netlify Drop**
1. https://app.netlify.com/drop 접속
2. `profile-guestbook` 폴더를 통째로 드래그해서 놓기
3. 몇 초 뒤 `https://랜덤이름.netlify.app` 같은 링크가 생성됨 → 이 링크를 친구들에게 공유

**GitHub Pages를 쓰고 싶다면**
1. GitHub에 새 저장소 생성 후 이 폴더의 파일들을 업로드(push)
2. 저장소 Settings → Pages → Branch를 `main`으로 설정
3. `https://내아이디.github.io/저장소이름` 링크로 접속 가능

배포 후에도 `config.js`만 그대로 유지하면 프로필/방명록 데이터는 Supabase에 계속 남아있어요.

## 5. (추가 기능) 방명록 이미지 첨부 + 인용/마음 반응

이미 2번 단계 SQL을 실행하셨다면, 아래 내용을 **새 쿼리 창**에 추가로 실행해주세요. 기존 데이터는 그대로 유지돼요.

### 5-1. 테이블에 컬럼/테이블 추가

```sql
alter table guestbook
  add column if not exists image_url text,
  add column if not exists like_count int not null default 0,
  add column if not exists quote_count int not null default 0;

create table if not exists guestbook_reactions (
  id bigint generated always as identity primary key,
  entry_id bigint not null references guestbook(id) on delete cascade,
  kind text not null check (kind in ('like', 'quote')),
  visitor_id text not null,
  created_at timestamptz not null default now(),
  unique (entry_id, kind, visitor_id)
);

alter table guestbook_reactions enable row level security;

create policy "reactions are publicly readable" on guestbook_reactions
  for select using (true);

create policy "anyone can react once" on guestbook_reactions
  for insert with check (
    kind in ('like', 'quote')
    and char_length(visitor_id) between 8 and 100
  );

create or replace function bump_reaction_count()
returns trigger
language plpgsql as $$
begin
  if new.kind = 'like' then
    update guestbook set like_count = like_count + 1 where id = new.entry_id;
  elsif new.kind = 'quote' then
    update guestbook set quote_count = quote_count + 1 where id = new.entry_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_bump_reaction_count on guestbook_reactions;
create trigger trg_bump_reaction_count
after insert on guestbook_reactions
for each row execute function bump_reaction_count();
```

> "인당 1회"는 브라우저에 저장되는 익명 방문자 ID + 데이터베이스의 `unique` 제약으로 막아요.
> 로그인 시스템이 없는 가벼운 개인 홈페이지라, 같은 사람이 브라우저를 바꾸거나 저장된 데이터를 지우면 다시 누를 수는 있어요 — 완벽한 잠금은 아니고, 방명록 성격에 맞는 가벼운 방지 정도로 봐주세요.

### 5-2. 이미지를 저장할 공간(Storage) 만들기

1. 왼쪽 사이드바에서 **Storage** 아이콘 클릭
2. **New bucket** 클릭 → 이름을 정확히 `guestbook-images` 로 입력 → **Public bucket** 토글 켜기 → 만들기
   (버킷 설정에서 File size limit을 5MB 정도로, Allowed MIME types를 `image/*`로 제한해두면 더 안전해요)
3. SQL Editor로 돌아가서 아래 정책을 추가로 실행

```sql
create policy "public can upload guestbook images"
on storage.objects for insert
to public
with check (bucket_id = 'guestbook-images');

create policy "public can view guestbook images"
on storage.objects for select
to public
using (bucket_id = 'guestbook-images');
```

이제 방명록 작성 창에 사진 아이콘이 생기고, 각 글 아래에 인용(♻)·마음(♥) 버튼이 표시돼요. 둘 다 한 사람당 한 번씩만 눌려요.

## 6. (추가 기능) 관리자 로그인 / 게시물 탭 / 방명록 개별 비밀번호

이번에도 **새 쿼리 창**에 아래 SQL 전체를 실행해주세요. 기존 데이터는 그대로 유지돼요.

```sql
-- 관리자 로그인 확인용 함수
create or replace function verify_passcode(p_passcode text)
returns boolean
language plpgsql
security definer
as $$
declare ok boolean;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into ok
  from profile where id = 1;
  return coalesce(ok, false);
end;
$$;
grant execute on function verify_passcode to anon;

-- 방명록: 글마다 개별 비밀번호를 가지도록 컬럼 추가
alter table guestbook
  add column if not exists passcode_hash text;

-- 방명록 직접 insert는 막고, 아래 함수로만 작성하도록 변경
drop policy if exists "anyone can write a guestbook entry" on guestbook;

create or replace function create_guestbook_entry(
  p_name text, p_message text, p_image_url text, p_passcode text
) returns bigint
language plpgsql
security definer
as $$
declare new_id bigint;
begin
  if char_length(p_name) < 1 or char_length(p_name) > 40 then
    raise exception 'invalid name';
  end if;
  if char_length(p_message) < 1 or char_length(p_message) > 280 then
    raise exception 'invalid message';
  end if;
  if char_length(p_passcode) < 4 then
    raise exception 'passcode too short';
  end if;

  insert into guestbook (name, message, image_url, passcode_hash)
  values (p_name, p_message, nullif(p_image_url, ''), crypt(p_passcode, gen_salt('bf')))
  returning id into new_id;

  return new_id;
end;
$$;
grant execute on function create_guestbook_entry to anon;

-- 삭제: 글쓴이 본인 비밀번호 또는 관리자 비밀번호 둘 다 허용
create or replace function delete_guestbook_entry(p_id bigint, p_passcode text)
returns boolean
language plpgsql
security definer
as $$
declare admin_ok boolean;
declare owner_ok boolean;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into admin_ok
  from profile where id = 1;

  select (passcode_hash is not null and passcode_hash = crypt(p_passcode, passcode_hash)) into owner_ok
  from guestbook where id = p_id;

  if coalesce(admin_ok, false) or coalesce(owner_ok, false) then
    delete from guestbook where id = p_id;
    return true;
  end if;
  return false;
end;
$$;
grant execute on function delete_guestbook_entry to anon;

-- 수정: 마찬가지로 글쓴이 본인 비밀번호 또는 관리자 비밀번호
create or replace function edit_guestbook_entry(p_id bigint, p_message text, p_passcode text)
returns boolean
language plpgsql
security definer
as $$
declare admin_ok boolean;
declare owner_ok boolean;
begin
  if char_length(p_message) < 1 or char_length(p_message) > 280 then
    raise exception 'invalid message';
  end if;

  select (passcode_hash = crypt(p_passcode, passcode_hash)) into admin_ok
  from profile where id = 1;

  select (passcode_hash is not null and passcode_hash = crypt(p_passcode, passcode_hash)) into owner_ok
  from guestbook where id = p_id;

  if coalesce(admin_ok, false) or coalesce(owner_ok, false) then
    update guestbook set message = p_message where id = p_id;
    return true;
  end if;
  return false;
end;
$$;
grant execute on function edit_guestbook_entry to anon;

-- 게시물(트위터 피드처럼 나만 쓰는 글) 테이블
create table if not exists posts (
  id bigint generated always as identity primary key,
  message text not null,
  image_url text,
  created_at timestamptz not null default now()
);
alter table posts enable row level security;

create policy "posts are publicly readable" on posts
  for select using (true);

create or replace function create_post(p_message text, p_image_url text, p_passcode text)
returns bigint
language plpgsql
security definer
as $$
declare ok boolean;
declare new_id bigint;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into ok
  from profile where id = 1;
  if not coalesce(ok, false) then
    raise exception 'invalid passcode';
  end if;
  if char_length(p_message) < 1 or char_length(p_message) > 280 then
    raise exception 'invalid message';
  end if;

  insert into posts (message, image_url) values (p_message, nullif(p_image_url, ''))
  returning id into new_id;
  return new_id;
end;
$$;
grant execute on function create_post to anon;

create or replace function delete_post(p_id bigint, p_passcode text)
returns boolean
language plpgsql
security definer
as $$
declare ok boolean;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into ok
  from profile where id = 1;
  if not coalesce(ok, false) then
    return false;
  end if;
  delete from posts where id = p_id;
  return true;
end;
$$;
grant execute on function delete_post to anon;
```

이제 이렇게 동작해요.
- 사이트에 처음 들어가면 우측 상단에 **"🔒 관리자"** 버튼만 보이고, "프로필 편집"은 안 보여요. 그 버튼을 눌러 관리자 비밀번호(2번 단계에서 설정한 것)를 입력해야만 "프로필 편집"과 "로그아웃"이 나타나요. (이 로그인 상태는 이 브라우저에만 저장돼요 — 다른 기기/브라우저에서는 다시 로그인해야 해요.)
- 상단 탭이 **게시물 / 방명록** 두 개로 나뉘어요. "게시물"은 관리자로 로그인했을 때만 글쓰기 창이 보이는, 오너 전용 피드예요.
- "방명록"에 글을 쓸 때 작성자/비밀번호/할 말 세 칸을 입력해요. 그 글의 "수정"·"삭제"는 **글쓴이 본인이 설정한 비밀번호** 또는 **관리자 비밀번호** 둘 중 하나로 가능해요.

## 7. (추가 기능) 배경 음악 플레이어

새 쿼리 창에 아래 SQL을 실행해주세요.

```sql
create table if not exists playlist_tracks (
  id bigint generated always as identity primary key,
  youtube_id text not null,
  title text not null,
  artist text,
  position int not null default 0,
  created_at timestamptz not null default now()
);
alter table playlist_tracks enable row level security;

create policy "playlist is publicly readable" on playlist_tracks
  for select using (true);

create or replace function create_playlist_track(
  p_youtube_id text, p_title text, p_artist text, p_passcode text
) returns bigint
language plpgsql
security definer
as $$
declare ok boolean;
declare new_id bigint;
declare next_pos int;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into ok
  from profile where id = 1;
  if not coalesce(ok, false) then
    raise exception 'invalid passcode';
  end if;

  select coalesce(max(position), -1) + 1 into next_pos from playlist_tracks;

  insert into playlist_tracks (youtube_id, title, artist, position)
  values (p_youtube_id, p_title, nullif(p_artist, ''), next_pos)
  returning id into new_id;

  return new_id;
end;
$$;
grant execute on function create_playlist_track to anon;

create or replace function delete_playlist_track(p_id bigint, p_passcode text)
returns boolean
language plpgsql
security definer
as $$
declare ok boolean;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into ok
  from profile where id = 1;
  if not coalesce(ok, false) then
    return false;
  end if;
  delete from playlist_tracks where id = p_id;
  return true;
end;
$$;
grant execute on function delete_playlist_track to anon;
```

이제 프로필 아래에 재생 바(◀◀ ▶ ▶▶ + 곡 제목/가수 + ⋯)가 생겨요. 관리자로 로그인한 상태에서 ⋯를 누르면 플레이리스트가 펼쳐지고 "+ 곡 추가" 버튼이 보여요. 유튜브 URL만 넣으면 제목·가수를 자동으로 가져오고(직접 수정도 가능), 방문자는 재생만 할 수 있고 곡 추가·삭제는 관리자만 할 수 있어요.

## 8. (추가 기능) 게시물 사진 최대 4장 첨부

새 쿼리 창에 아래 SQL을 실행해주세요. 기존 게시물의 사진(1장)은 자동으로 그대로 유지돼요.

```sql
alter table posts add column if not exists image_urls text[] not null default '{}';

update posts set image_urls = array[image_url]
where image_url is not null and image_url <> '' and coalesce(array_length(image_urls, 1), 0) = 0;

drop function if exists create_post(text, text, text);

create or replace function create_post(p_message text, p_image_urls text[], p_passcode text)
returns bigint
language plpgsql
security definer
as $$
declare ok boolean;
declare new_id bigint;
begin
  select (passcode_hash = crypt(p_passcode, passcode_hash)) into ok
  from profile where id = 1;
  if not coalesce(ok, false) then
    raise exception 'invalid passcode';
  end if;
  if char_length(p_message) < 1 or char_length(p_message) > 280 then
    raise exception 'invalid message';
  end if;
  if coalesce(array_length(p_image_urls, 1), 0) > 4 then
    raise exception 'too many images';
  end if;

  insert into posts (message, image_urls) values (p_message, coalesce(p_image_urls, '{}'))
  returning id into new_id;
  return new_id;
end;
$$;
grant execute on function create_post(text, text[], text) to anon;
```

이제 게시물 작성 창에서 사진을 최대 4장까지 첨부할 수 있고, 게시물 목록에서 트위터처럼 장 수에 맞는 그리드로 보여요 (1장은 그대로, 2~4장은 격자). 사진을 클릭하면 크게 볼 수도 있어요.

## 9. (추가 기능) 게시물에도 인용·마음 반응 버튼

방명록과 똑같은 방식으로, 게시물에도 인용(♻)·마음(♥) 버튼이 생겨요. 한 사람당 게시물 하나에 한 번씩만 누를 수 있어요. 새 쿼리 창에 아래 SQL을 실행해주세요.

```sql
alter table posts
  add column if not exists like_count int not null default 0,
  add column if not exists quote_count int not null default 0;

create table if not exists post_reactions (
  id bigint generated always as identity primary key,
  entry_id bigint not null references posts(id) on delete cascade,
  kind text not null check (kind in ('like', 'quote')),
  visitor_id text not null,
  created_at timestamptz not null default now(),
  unique (entry_id, kind, visitor_id)
);

alter table post_reactions enable row level security;

create policy "post reactions are publicly readable" on post_reactions
  for select using (true);

create policy "anyone can react to a post once" on post_reactions
  for insert with check (
    kind in ('like', 'quote')
    and char_length(visitor_id) between 8 and 100
  );

create or replace function bump_post_reaction_count()
returns trigger
language plpgsql as $$
begin
  if new.kind = 'like' then
    update posts set like_count = like_count + 1 where id = new.entry_id;
  elsif new.kind = 'quote' then
    update posts set quote_count = quote_count + 1 where id = new.entry_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_bump_post_reaction_count on post_reactions;
create trigger trg_bump_post_reaction_count
after insert on post_reactions
for each row execute function bump_post_reaction_count();
```

## 10. (추가 기능) 인용·마음 다시 누르면 취소

지금까지는 한 번 누르면 계속 눌린 상태로 고정이었는데, 이제 다시 누르면 취소(카운트 -1)되도록 바뀌어요. 방명록·게시물 둘 다 적용됩니다. 새 쿼리 창에 아래 SQL을 실행해주세요.

```sql
-- 방명록
create policy "anyone can remove their guestbook reaction" on guestbook_reactions
  for delete using (true);

create or replace function bump_reaction_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if tg_op = 'INSERT' then
    if new.kind = 'like' then
      update guestbook set like_count = like_count + 1 where id = new.entry_id;
    elsif new.kind = 'quote' then
      update guestbook set quote_count = quote_count + 1 where id = new.entry_id;
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    if old.kind = 'like' then
      update guestbook set like_count = greatest(like_count - 1, 0) where id = old.entry_id;
    elsif old.kind = 'quote' then
      update guestbook set quote_count = greatest(quote_count - 1, 0) where id = old.entry_id;
    end if;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_bump_reaction_count on guestbook_reactions;
create trigger trg_bump_reaction_count
after insert or delete on guestbook_reactions
for each row execute function bump_reaction_count();

-- 게시물
create policy "anyone can remove their post reaction" on post_reactions
  for delete using (true);

create or replace function bump_post_reaction_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if tg_op = 'INSERT' then
    if new.kind = 'like' then
      update posts set like_count = like_count + 1 where id = new.entry_id;
    elsif new.kind = 'quote' then
      update posts set quote_count = quote_count + 1 where id = new.entry_id;
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    if old.kind = 'like' then
      update posts set like_count = greatest(like_count - 1, 0) where id = old.entry_id;
    elsif old.kind = 'quote' then
      update posts set quote_count = greatest(quote_count - 1, 0) where id = old.entry_id;
    end if;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_bump_post_reaction_count on post_reactions;
create trigger trg_bump_post_reaction_count
after insert or delete on post_reactions
for each row execute function bump_post_reaction_count();
```
