const DEMO_MODE = !SUPABASE_URL || SUPABASE_URL.includes('YOUR-PROJECT');
const client = DEMO_MODE ? null : supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEMO_PROFILE_KEY = 'guestbook_demo_profile';
const DEMO_ENTRIES_KEY = 'guestbook_demo_entries';
const DEMO_POSTS_KEY = 'guestbook_demo_posts';
const DEMO_PLAYLIST_KEY = 'guestbook_demo_playlist';
const DEMO_PASSCODE = '1234';
const ADMIN_KEY = 'guestbook_is_admin';

function demoLoadProfile() {
  const stored = localStorage.getItem(DEMO_PROFILE_KEY);
  if (stored) return JSON.parse(stored);
  return {
    name: '홍길동',
    handle: 'gildong',
    bio: '반가워요! 여기는 제 개인 홈페이지예요.\n아래에 방명록을 남겨주세요 :)',
    location: '서울',
    joined_label: '2026년부터',
    avatar_url: '',
    cover_url: '',
  };
}
function demoSaveProfile(p) {
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(p));
}

function demoLoadEntries() {
  const stored = localStorage.getItem(DEMO_ENTRIES_KEY);
  if (stored) return JSON.parse(stored);
  const seed = [
    { id: 2, name: '김민지', message: '홈페이지 너무 예쁘게 잘 만들었다!! 자주 놀러올게 ㅎㅎ', image_url: '', passcode: '1111', like_count: 3, quote_count: 1, created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
    { id: 1, name: '이준호', message: '방명록 첫 글 남기고 갑니다 👋', image_url: '', passcode: '2222', like_count: 1, quote_count: 0, created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString() },
  ];
  localStorage.setItem(DEMO_ENTRIES_KEY, JSON.stringify(seed));
  return seed;
}
function demoSaveEntries(rows) {
  localStorage.setItem(DEMO_ENTRIES_KEY, JSON.stringify(rows));
}

function demoLoadPosts() {
  const stored = localStorage.getItem(DEMO_POSTS_KEY);
  if (stored) return JSON.parse(stored);
  const seed = [
    { id: 1, message: '이 사이트 만들어봤어요. 아래 방명록에 놀러와주세요 :)', image_url: '', created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
  ];
  localStorage.setItem(DEMO_POSTS_KEY, JSON.stringify(seed));
  return seed;
}
function demoSavePosts(rows) {
  localStorage.setItem(DEMO_POSTS_KEY, JSON.stringify(rows));
}

function demoLoadPlaylist() {
  const stored = localStorage.getItem(DEMO_PLAYLIST_KEY);
  return stored ? JSON.parse(stored) : [];
}
function demoSavePlaylist(rows) {
  localStorage.setItem(DEMO_PLAYLIST_KEY, JSON.stringify(rows));
}

function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === 'true';
}
function setAdmin(value) {
  if (value) localStorage.setItem(ADMIN_KEY, 'true');
  else localStorage.removeItem(ADMIN_KEY);
}

const REACTED_KEY = 'guestbook_reacted_v1';
function getReactedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(REACTED_KEY) || '[]'));
  } catch {
    return new Set();
  }
}
function hasReacted(id, kind) {
  return getReactedSet().has(`${id}:${kind}`);
}
function markReacted(id, kind) {
  const set = getReactedSet();
  set.add(`${id}:${kind}`);
  localStorage.setItem(REACTED_KEY, JSON.stringify([...set]));
}

function getVisitorId() {
  let id = localStorage.getItem('guestbook_visitor_id');
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('guestbook_visitor_id', id);
  }
  return id;
}

const els = {
  cover: document.getElementById('cover'),
  avatar: document.getElementById('avatar'),
  name: document.getElementById('name'),
  handle: document.getElementById('handle'),
  bio: document.getElementById('bio'),
  meta: document.getElementById('meta'),

  adminLoginBtn: document.getElementById('adminLoginBtn'),
  adminControls: document.getElementById('adminControls'),
  logoutBtn: document.getElementById('logoutBtn'),

  prevBtn: document.getElementById('prevBtn'),
  playBtn: document.getElementById('playBtn'),
  nextBtn: document.getElementById('nextBtn'),
  playerTitle: document.getElementById('playerTitle'),
  playerArtist: document.getElementById('playerArtist'),
  playerMoreBtn: document.getElementById('playerMoreBtn'),
  playlistPanel: document.getElementById('playlistPanel'),
  playlistList: document.getElementById('playlistList'),
  playlistAddBtn: document.getElementById('playlistAddBtn'),

  tabBtnPosts: document.getElementById('tabBtnPosts'),
  tabBtnGuestbook: document.getElementById('tabBtnGuestbook'),
  postsTab: document.getElementById('postsTab'),
  guestbookTab: document.getElementById('guestbookTab'),

  posts: document.getElementById('posts'),
  postForm: document.getElementById('postForm'),
  pMessage: document.getElementById('pMessage'),
  postCharCount: document.getElementById('postCharCount'),
  postSubmitBtn: document.getElementById('postSubmitBtn'),
  postFormMsg: document.getElementById('postFormMsg'),
  postMediaBtn: document.getElementById('postMediaBtn'),
  postMediaInput: document.getElementById('postMediaInput'),
  postMediaPreview: document.getElementById('postMediaPreview'),
  postMediaPreviewImg: document.getElementById('postMediaPreviewImg'),
  postMediaRemoveBtn: document.getElementById('postMediaRemoveBtn'),

  entries: document.getElementById('entries'),
  guestForm: document.getElementById('guestForm'),
  gName: document.getElementById('gName'),
  gPasscode: document.getElementById('gPasscode'),
  gMessage: document.getElementById('gMessage'),
  charCount: document.getElementById('charCount'),
  submitBtn: document.getElementById('submitBtn'),
  formMsg: document.getElementById('formMsg'),
  mediaBtn: document.getElementById('mediaBtn'),
  mediaInput: document.getElementById('mediaInput'),
  mediaPreview: document.getElementById('mediaPreview'),
  mediaPreviewImg: document.getElementById('mediaPreviewImg'),
  mediaRemoveBtn: document.getElementById('mediaRemoveBtn'),

  editOpenBtn: document.getElementById('editOpenBtn'),
  editCloseBtn: document.getElementById('editCloseBtn'),
  editCancelBtn: document.getElementById('editCancelBtn'),
  editOverlay: document.getElementById('editOverlay'),
  editForm: document.getElementById('editForm'),
  editSaveBtn: document.getElementById('editSaveBtn'),
  editMsg: document.getElementById('editMsg'),
  fName: document.getElementById('fName'),
  fHandle: document.getElementById('fHandle'),
  fBio: document.getElementById('fBio'),
  fLocation: document.getElementById('fLocation'),
  fJoined: document.getElementById('fJoined'),
  fAvatarPreview: document.getElementById('fAvatarPreview'),
  fAvatarPreviewImg: document.getElementById('fAvatarPreviewImg'),
  fAvatarEmptyText: document.getElementById('fAvatarEmptyText'),
  fAvatarPickBtn: document.getElementById('fAvatarPickBtn'),
  fAvatarRemoveBtn: document.getElementById('fAvatarRemoveBtn'),
  fAvatarInput: document.getElementById('fAvatarInput'),
  fCoverPreview: document.getElementById('fCoverPreview'),
  fCoverPreviewImg: document.getElementById('fCoverPreviewImg'),
  fCoverEmptyText: document.getElementById('fCoverEmptyText'),
  fCoverPickBtn: document.getElementById('fCoverPickBtn'),
  fCoverRemoveBtn: document.getElementById('fCoverRemoveBtn'),
  fCoverInput: document.getElementById('fCoverInput'),
  fPasscode: document.getElementById('fPasscode'),
};

let currentProfile = null;
let lastPostsData = [];
let playlistTracks = [];
let currentTrackIndex = -1;
let ytPlayer = null;
let ytApiReady = false;
let pendingAutoplayTrackIndex = null;

function initials(name) {
  if (!name) return '?';
  const trimmed = name.trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function relativeTime(iso) {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (diffSec < 60) return '방금 전';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function extractYoutubeId(url) {
  const patterns = [
    /youtube\.com\/watch\?.*v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function locationIcon() {
  return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
}
function calendarIcon() {
  return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
}
function commentIcon() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.3a8.4 8.4 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.4-8.4h.1a8.4 8.4 0 0 1 8.4 8.4z"/></svg>';
}
function quoteIcon() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
}
function heartIcon() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
}

function renderProfile(profile) {
  currentProfile = profile;
  els.name.textContent = profile.name || '이름을 입력하세요';
  els.handle.textContent = `@${profile.handle || 'username'}`;
  els.bio.textContent = profile.bio || '';
  els.bio.style.display = profile.bio ? '' : 'none';

  if (profile.avatar_url) {
    els.avatar.style.backgroundImage = `url("${profile.avatar_url}")`;
    els.avatar.textContent = '';
  } else {
    els.avatar.style.backgroundImage = '';
    els.avatar.textContent = initials(profile.name);
  }

  if (profile.cover_url) {
    els.cover.style.backgroundImage = `url("${profile.cover_url}")`;
  } else {
    els.cover.style.backgroundImage = '';
  }

  const metaParts = [];
  if (profile.location) {
    metaParts.push(`<span>${locationIcon()}${escapeHtml(profile.location)}</span>`);
  }
  if (profile.joined_label) {
    metaParts.push(`<span>${calendarIcon()}${escapeHtml(profile.joined_label)}</span>`);
  }
  els.meta.innerHTML = metaParts.join('');
}

function renderEntries(rows) {
  if (!rows.length) {
    els.entries.innerHTML = '<li class="empty-state">아직 방명록이 비어 있어요. 첫 글을 남겨보세요!</li>';
    return;
  }
  els.entries.innerHTML = rows.map((row) => `
    <li class="entry" data-id="${row.id}">
      <div class="entry-avatar">${escapeHtml(initials(row.name))}</div>
      <div class="entry-body">
        <div class="entry-head">
          <span class="entry-name">${escapeHtml(row.name)}</span>
          <span class="entry-time">· ${relativeTime(row.created_at)}</span>
          <span class="entry-owner-actions">
            <button class="entry-edit" data-id="${row.id}" type="button" title="수정 (내 비밀번호 필요)">수정</button>
            <button class="entry-del" data-id="${row.id}" type="button" title="삭제 (내 비밀번호 필요)">삭제</button>
          </span>
        </div>
        <p class="entry-msg">${escapeHtml(row.message)}</p>
        ${row.image_url ? `<img class="entry-image" src="${row.image_url}" alt="${escapeHtml(row.name)}님이 첨부한 이미지" loading="lazy" />` : ''}
        <div class="entry-actions">
          <span class="reaction-static" aria-hidden="true">${commentIcon()}</span>
          <button class="reaction-btn ${hasReacted(row.id, 'quote') ? 'is-active' : ''}" type="button" data-kind="quote" data-id="${row.id}" title="인용">
            ${quoteIcon()}<span>${row.quote_count || 0}</span>
          </button>
          <button class="reaction-btn ${hasReacted(row.id, 'like') ? 'is-active' : ''}" type="button" data-kind="like" data-id="${row.id}" title="마음">
            ${heartIcon()}<span>${row.like_count || 0}</span>
          </button>
        </div>
      </div>
    </li>
  `).join('');
}

function renderPosts(rows) {
  lastPostsData = rows;
  if (!rows.length) {
    els.posts.innerHTML = '<li class="empty-state">아직 게시물이 없어요.</li>';
    return;
  }
  const ownerName = currentProfile?.name || '';
  const ownerAvatar = currentProfile?.avatar_url || '';
  const avatarStyle = ownerAvatar ? ` style="background-image:url('${ownerAvatar}')"` : '';

  els.posts.innerHTML = rows.map((row) => `
    <li class="entry" data-id="${row.id}">
      <div class="entry-avatar"${avatarStyle}>${ownerAvatar ? '' : escapeHtml(initials(ownerName))}</div>
      <div class="entry-body">
        <div class="entry-head">
          <span class="entry-name">${escapeHtml(ownerName)}</span>
          <span class="entry-time">· ${relativeTime(row.created_at)}</span>
          ${isAdmin() ? `<span class="entry-owner-actions"><button class="post-del" data-id="${row.id}" type="button" title="삭제">삭제</button></span>` : ''}
        </div>
        <p class="entry-msg">${escapeHtml(row.message)}</p>
        ${row.image_url ? `<img class="entry-image" src="${row.image_url}" alt="첨부 이미지" loading="lazy" />` : ''}
      </div>
    </li>
  `).join('');
}

async function loadProfile() {
  if (DEMO_MODE) {
    renderProfile(demoLoadProfile());
    return;
  }
  const { data, error } = await client
    .from('profile')
    .select('id, name, handle, bio, location, joined_label, avatar_url, cover_url')
    .eq('id', 1)
    .single();
  if (error) {
    console.error('프로필 로드 실패', error);
    els.name.textContent = '설정이 필요해요';
    els.bio.textContent = 'config.js와 Supabase 테이블 설정을 확인해주세요.';
    els.bio.style.display = '';
    return;
  }
  renderProfile(data);
}

async function loadEntries() {
  if (DEMO_MODE) {
    const rows = demoLoadEntries().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    renderEntries(rows);
    return;
  }
  const { data, error } = await client
    .from('guestbook')
    .select('id, name, message, image_url, like_count, quote_count, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.error('방명록 로드 실패', error);
    els.entries.innerHTML = '<li class="empty-state">방명록을 불러오지 못했어요.</li>';
    return;
  }
  renderEntries(data);
}

async function loadPosts() {
  if (DEMO_MODE) {
    const rows = demoLoadPosts().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    renderPosts(rows);
    return;
  }
  const { data, error } = await client
    .from('posts')
    .select('id, message, image_url, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.error('게시물 로드 실패', error);
    els.posts.innerHTML = '<li class="empty-state">게시물을 불러오지 못했어요.</li>';
    return;
  }
  renderPosts(data);
}

function renderPlaylist(rows) {
  playlistTracks = rows;

  if (!rows.length) {
    els.playlistList.innerHTML = '<li class="playlist-empty">아직 등록된 곡이 없어요.</li>';
  } else {
    els.playlistList.innerHTML = rows.map((track, i) => `
      <li class="playlist-track ${i === currentTrackIndex ? 'is-active' : ''}" data-index="${i}" style="--i:${i}">
        <span class="track-index">${i + 1}</span>
        <div class="track-info">
          <p class="track-title">${escapeHtml(track.title)}</p>
          ${track.artist ? `<p class="track-artist">${escapeHtml(track.artist)}</p>` : ''}
        </div>
        ${isAdmin() ? `<button class="track-del" data-id="${track.id}" type="button" title="삭제">삭제</button>` : ''}
      </li>
    `).join('');
  }

  els.playlistAddBtn.hidden = !isAdmin();

  const hasTracks = rows.length > 0;
  els.playBtn.disabled = !hasTracks;
  els.prevBtn.disabled = !hasTracks;
  els.nextBtn.disabled = !hasTracks;

  if (currentTrackIndex === -1 || !rows.length) {
    els.playerTitle.textContent = hasTracks ? '재생할 곡을 골라보세요' : '재생할 곡이 없어요';
    els.playerArtist.textContent = '';
  }
}

async function loadPlaylist() {
  if (DEMO_MODE) {
    renderPlaylist(demoLoadPlaylist());
    playlistReadyForAutoplay = true;
    maybeAutoplay();
    return;
  }
  const { data, error } = await client
    .from('playlist_tracks')
    .select('id, youtube_id, title, artist, position')
    .order('position', { ascending: true });
  if (error) {
    console.error('플레이리스트 로드 실패', error);
    return;
  }
  renderPlaylist(data);
  playlistReadyForAutoplay = true;
  maybeAutoplay();
}

/* ---- music player ---- */

let hasInteracted = false;
let playlistReadyForAutoplay = false;

function maybeAutoplay() {
  if (!hasInteracted || !playlistReadyForAutoplay) return;
  if (currentTrackIndex !== -1) return;
  if (!playlistTracks.length) return;
  ensureYouTubeApi();
  playTrackAt(0);
}

function armAutoplay() {
  if (hasInteracted) return;
  hasInteracted = true;
  maybeAutoplay();
}
['pointerdown', 'keydown'].forEach((evt) => {
  document.addEventListener(evt, armAutoplay, { once: true, passive: true });
});

function playIcon() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
}
function pauseIcon() {
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
}

function updatePlayerMeta(track) {
  els.playerTitle.textContent = track.title;
  els.playerArtist.textContent = track.artist || '';
}

function ensureYouTubeApi() {
  if (window.YT && window.YT.Player) {
    if (!ytPlayer) initYtPlayer();
    return;
  }
  if (!document.getElementById('yt-iframe-api')) {
    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
  window.onYouTubeIframeAPIReady = initYtPlayer;
}

function initYtPlayer() {
  ytPlayer = new YT.Player('ytPlayer', {
    height: '0',
    width: '0',
    playerVars: { playsinline: 1 },
    events: {
      onReady: () => {
        ytApiReady = true;
        if (pendingAutoplayTrackIndex !== null) {
          const idx = pendingAutoplayTrackIndex;
          pendingAutoplayTrackIndex = null;
          playTrackAt(idx);
        }
      },
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    els.playBtn.innerHTML = pauseIcon();
  } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.CUED) {
    els.playBtn.innerHTML = playIcon();
  } else if (e.data === YT.PlayerState.ENDED) {
    els.playBtn.innerHTML = playIcon();
    playTrackAt(currentTrackIndex + 1);
  }
}

function playTrackAt(index) {
  if (!playlistTracks.length) return;
  const wrapped = ((index % playlistTracks.length) + playlistTracks.length) % playlistTracks.length;
  currentTrackIndex = wrapped;
  const track = playlistTracks[wrapped];
  updatePlayerMeta(track);
  renderPlaylist(playlistTracks);

  if (!ytApiReady || !ytPlayer) {
    pendingAutoplayTrackIndex = wrapped;
    ensureYouTubeApi();
    return;
  }
  ytPlayer.loadVideoById(track.youtube_id);
}

els.playBtn.addEventListener('click', () => {
  if (!playlistTracks.length) return;
  if (currentTrackIndex === -1) {
    playTrackAt(0);
    return;
  }
  if (!ytApiReady || !ytPlayer) {
    ensureYouTubeApi();
    return;
  }
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
});

els.prevBtn.addEventListener('click', () => {
  if (!playlistTracks.length) return;
  playTrackAt(currentTrackIndex === -1 ? playlistTracks.length - 1 : currentTrackIndex - 1);
});

els.nextBtn.addEventListener('click', () => {
  if (!playlistTracks.length) return;
  playTrackAt(currentTrackIndex === -1 ? 0 : currentTrackIndex + 1);
});

els.playerMoreBtn.addEventListener('click', () => {
  const isOpen = els.playlistPanel.classList.toggle('is-open');
  els.playerMoreBtn.setAttribute('aria-expanded', String(isOpen));
});

els.playlistList.addEventListener('click', async (e) => {
  const delBtn = e.target.closest('.track-del');
  if (delBtn) {
    const id = Number(delBtn.dataset.id);
    const passcode = window.prompt('삭제하려면 관리자 비밀번호를 입력하세요.');
    if (!passcode) return;

    if (DEMO_MODE) {
      if (passcode !== DEMO_PASSCODE) {
        alert('비밀번호가 올바르지 않아요.');
        return;
      }
      demoSavePlaylist(demoLoadPlaylist().filter((t) => t.id !== id));
      if (currentTrackIndex >= 0) currentTrackIndex = -1;
      await loadPlaylist();
      return;
    }

    const { data, error } = await client.rpc('delete_playlist_track', { p_id: id, p_passcode: passcode });
    if (error || !data) {
      alert('삭제하지 못했어요. 비밀번호를 확인해주세요.');
      return;
    }
    if (currentTrackIndex >= 0) currentTrackIndex = -1;
    await loadPlaylist();
    return;
  }

  const row = e.target.closest('.playlist-track');
  if (row) {
    playTrackAt(Number(row.dataset.index));
  }
});

els.playlistAddBtn.addEventListener('click', async () => {
  const url = window.prompt('유튜브 URL을 입력하세요.');
  if (!url) return;
  const youtubeId = extractYoutubeId(url.trim());
  if (!youtubeId) {
    alert('유튜브 링크를 인식하지 못했어요. watch?v= 또는 youtu.be 형식인지 확인해주세요.');
    return;
  }

  let title = '';
  let artist = '';
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url.trim())}&format=json`);
    if (res.ok) {
      const meta = await res.json();
      title = meta.title || '';
      artist = meta.author_name || '';
    }
  } catch (err) {
    console.warn('노래 정보를 가져오지 못했어요', err);
  }

  const finalTitle = window.prompt('노래 제목', title);
  if (finalTitle === null) return;
  const finalArtist = window.prompt('가수', artist);
  if (finalArtist === null) return;

  const passcode = window.prompt('관리자 비밀번호를 입력하세요.');
  if (!passcode) return;

  if (DEMO_MODE) {
    if (passcode !== DEMO_PASSCODE) {
      alert('비밀번호가 올바르지 않아요.');
      return;
    }
    const rows = demoLoadPlaylist();
    rows.push({
      id: Date.now(),
      youtube_id: youtubeId,
      title: finalTitle.trim() || '제목 없음',
      artist: finalArtist.trim(),
      position: rows.length,
    });
    demoSavePlaylist(rows);
    await loadPlaylist();
    return;
  }

  const { error } = await client.rpc('create_playlist_track', {
    p_youtube_id: youtubeId,
    p_title: finalTitle.trim() || '제목 없음',
    p_artist: finalArtist.trim(),
    p_passcode: passcode,
  });
  if (error) {
    console.error(error);
    alert('추가하지 못했어요. 비밀번호를 확인해주세요.');
    return;
  }
  await loadPlaylist();
});

/* ---- admin session ---- */

function applyAdminVisibility() {
  const admin = isAdmin();
  els.adminLoginBtn.hidden = admin;
  els.adminControls.hidden = !admin;
  els.postForm.hidden = !admin;
  renderPosts(lastPostsData);
  renderPlaylist(playlistTracks);
}

els.adminLoginBtn.addEventListener('click', async () => {
  const passcode = window.prompt('관리자 비밀번호를 입력하세요.');
  if (!passcode) return;

  if (DEMO_MODE) {
    if (passcode !== DEMO_PASSCODE) {
      alert(`비밀번호가 올바르지 않아요. (데모 비밀번호: ${DEMO_PASSCODE})`);
      return;
    }
    setAdmin(true);
    applyAdminVisibility();
    return;
  }

  const { data, error } = await client.rpc('verify_passcode', { p_passcode: passcode });
  if (error || !data) {
    alert('비밀번호가 올바르지 않아요.');
    return;
  }
  setAdmin(true);
  applyAdminVisibility();
});

els.logoutBtn.addEventListener('click', () => {
  setAdmin(false);
  applyAdminVisibility();
});

/* ---- tabs ---- */

function selectTab(tab) {
  const isPosts = tab === 'posts';
  els.tabBtnPosts.classList.toggle('is-active', isPosts);
  els.tabBtnGuestbook.classList.toggle('is-active', !isPosts);
  els.tabBtnPosts.setAttribute('aria-selected', String(isPosts));
  els.tabBtnGuestbook.setAttribute('aria-selected', String(!isPosts));
  els.postsTab.hidden = !isPosts;
  els.guestbookTab.hidden = isPosts;
}
els.tabBtnPosts.addEventListener('click', () => selectTab('posts'));
els.tabBtnGuestbook.addEventListener('click', () => selectTab('guestbook'));

/* ---- guestbook compose ---- */

els.gMessage.addEventListener('input', () => {
  els.charCount.textContent = `${els.gMessage.value.length} / 280`;
});

let selectedImageFile = null;
let selectedImageDataUrl = null;

els.mediaBtn.addEventListener('click', () => els.mediaInput.click());

els.mediaInput.addEventListener('change', () => {
  const file = els.mediaInput.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    els.formMsg.textContent = '이미지는 5MB 이하로 올려주세요.';
    els.mediaInput.value = '';
    return;
  }
  els.formMsg.textContent = '';
  selectedImageFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    selectedImageDataUrl = reader.result;
    els.mediaPreviewImg.src = selectedImageDataUrl;
    els.mediaPreview.hidden = false;
  };
  reader.readAsDataURL(file);
});

function clearMediaSelection() {
  selectedImageFile = null;
  selectedImageDataUrl = null;
  els.mediaInput.value = '';
  els.mediaPreview.hidden = true;
  els.mediaPreviewImg.src = '';
}

els.mediaRemoveBtn.addEventListener('click', clearMediaSelection);

els.guestForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = els.gName.value.trim();
  const passcode = els.gPasscode.value;
  const message = els.gMessage.value.trim();
  els.formMsg.textContent = '';

  if (!name || !message) {
    els.formMsg.textContent = '작성자와 할 말을 모두 입력해주세요.';
    return;
  }
  if (passcode.length < 4) {
    els.formMsg.textContent = '비밀번호는 4자 이상으로 입력해주세요.';
    return;
  }

  els.submitBtn.disabled = true;

  if (DEMO_MODE) {
    const rows = demoLoadEntries();
    rows.push({
      id: Date.now(),
      name,
      passcode,
      message,
      image_url: selectedImageDataUrl || '',
      like_count: 0,
      quote_count: 0,
      created_at: new Date().toISOString(),
    });
    demoSaveEntries(rows);
  } else {
    let imageUrl = '';
    if (selectedImageFile) {
      const ext = (selectedImageFile.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `guestbook/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await client.storage.from('guestbook-images').upload(path, selectedImageFile);
      if (uploadError) {
        console.error(uploadError);
        els.submitBtn.disabled = false;
        els.formMsg.textContent = '이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.';
        return;
      }
      const { data: pub } = client.storage.from('guestbook-images').getPublicUrl(path);
      imageUrl = pub.publicUrl;
    }

    const { error } = await client.rpc('create_guestbook_entry', {
      p_name: name,
      p_message: message,
      p_image_url: imageUrl,
      p_passcode: passcode,
    });
    if (error) {
      console.error(error);
      els.submitBtn.disabled = false;
      els.formMsg.textContent = '전송에 실패했어요. 잠시 후 다시 시도해주세요.';
      return;
    }
  }
  els.submitBtn.disabled = false;

  els.guestForm.reset();
  els.charCount.textContent = '0 / 280';
  clearMediaSelection();
  await loadEntries();
});

els.entries.addEventListener('click', async (e) => {
  const delBtn = e.target.closest('.entry-del');
  const editBtn = e.target.closest('.entry-edit');

  if (delBtn) {
    const id = Number(delBtn.dataset.id);
    const passcode = window.prompt('삭제하려면 비밀번호를 입력하세요. (내가 쓴 비밀번호 또는 관리자 비밀번호)');
    if (!passcode) return;

    if (DEMO_MODE) {
      const rows = demoLoadEntries();
      const target = rows.find((row) => row.id === id);
      if (!target || (passcode !== target.passcode && passcode !== DEMO_PASSCODE)) {
        alert('삭제하지 못했어요. 비밀번호를 확인해주세요.');
        return;
      }
      demoSaveEntries(rows.filter((row) => row.id !== id));
      await loadEntries();
      return;
    }

    const { data, error } = await client.rpc('delete_guestbook_entry', { p_id: id, p_passcode: passcode });
    if (error || !data) {
      alert('삭제하지 못했어요. 비밀번호를 확인해주세요.');
      return;
    }
    await loadEntries();
    return;
  }

  if (editBtn) {
    const id = Number(editBtn.dataset.id);
    const passcode = window.prompt('수정하려면 비밀번호를 입력하세요. (내가 쓴 비밀번호 또는 관리자 비밀번호)');
    if (!passcode) return;

    if (DEMO_MODE) {
      const rows = demoLoadEntries();
      const target = rows.find((row) => row.id === id);
      if (!target || (passcode !== target.passcode && passcode !== DEMO_PASSCODE)) {
        alert('수정하지 못했어요. 비밀번호를 확인해주세요.');
        return;
      }
      const newMessage = window.prompt('새 내용을 입력하세요.', target.message);
      if (newMessage === null || !newMessage.trim()) return;
      target.message = newMessage.trim();
      demoSaveEntries(rows);
      await loadEntries();
      return;
    }

    const row = (await client.from('guestbook').select('message').eq('id', id).single()).data;
    const newMessage = window.prompt('새 내용을 입력하세요.', row ? row.message : '');
    if (newMessage === null || !newMessage.trim()) return;

    const { data, error } = await client.rpc('edit_guestbook_entry', {
      p_id: id,
      p_message: newMessage.trim(),
      p_passcode: passcode,
    });
    if (error || !data) {
      alert('수정하지 못했어요. 비밀번호를 확인해주세요.');
      return;
    }
    await loadEntries();
    return;
  }

  const reactBtn = e.target.closest('.reaction-btn');
  if (reactBtn) {
    const id = Number(reactBtn.dataset.id);
    const kind = reactBtn.dataset.kind;
    if (reactBtn.disabled || hasReacted(id, kind)) return;
    reactBtn.disabled = true;

    if (DEMO_MODE) {
      const rows = demoLoadEntries();
      const target = rows.find((row) => row.id === id);
      if (target) {
        const field = kind === 'like' ? 'like_count' : 'quote_count';
        target[field] = (target[field] || 0) + 1;
        demoSaveEntries(rows);
      }
      markReacted(id, kind);
      await loadEntries();
      return;
    }

    const { error } = await client.from('guestbook_reactions').insert({
      entry_id: id,
      kind,
      visitor_id: getVisitorId(),
    });

    if (error && error.code !== '23505') {
      console.error(error);
      reactBtn.disabled = false;
      return;
    }
    markReacted(id, kind);
    await loadEntries();
  }
});

/* ---- posts compose (admin only) ---- */

els.pMessage.addEventListener('input', () => {
  els.postCharCount.textContent = `${els.pMessage.value.length} / 280`;
});

let selectedPostImageFile = null;
let selectedPostImageDataUrl = null;

els.postMediaBtn.addEventListener('click', () => els.postMediaInput.click());

els.postMediaInput.addEventListener('change', () => {
  const file = els.postMediaInput.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    els.postFormMsg.textContent = '이미지는 5MB 이하로 올려주세요.';
    els.postMediaInput.value = '';
    return;
  }
  els.postFormMsg.textContent = '';
  selectedPostImageFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    selectedPostImageDataUrl = reader.result;
    els.postMediaPreviewImg.src = selectedPostImageDataUrl;
    els.postMediaPreview.hidden = false;
  };
  reader.readAsDataURL(file);
});

function clearPostMediaSelection() {
  selectedPostImageFile = null;
  selectedPostImageDataUrl = null;
  els.postMediaInput.value = '';
  els.postMediaPreview.hidden = true;
  els.postMediaPreviewImg.src = '';
}

els.postMediaRemoveBtn.addEventListener('click', clearPostMediaSelection);

els.postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = els.pMessage.value.trim();
  els.postFormMsg.textContent = '';

  if (!message) {
    els.postFormMsg.textContent = '내용을 입력해주세요.';
    return;
  }

  const passcode = window.prompt('관리자 비밀번호를 입력하세요.');
  if (!passcode) return;

  els.postSubmitBtn.disabled = true;

  if (DEMO_MODE) {
    if (passcode !== DEMO_PASSCODE) {
      els.postSubmitBtn.disabled = false;
      els.postFormMsg.textContent = `비밀번호가 올바르지 않아요. (데모 비밀번호: ${DEMO_PASSCODE})`;
      return;
    }
    const rows = demoLoadPosts();
    rows.push({
      id: Date.now(),
      message,
      image_url: selectedPostImageDataUrl || '',
      created_at: new Date().toISOString(),
    });
    demoSavePosts(rows);
  } else {
    let imageUrl = '';
    if (selectedPostImageFile) {
      const ext = (selectedPostImageFile.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await client.storage.from('guestbook-images').upload(path, selectedPostImageFile);
      if (uploadError) {
        console.error(uploadError);
        els.postSubmitBtn.disabled = false;
        els.postFormMsg.textContent = '이미지 업로드에 실패했어요.';
        return;
      }
      const { data: pub } = client.storage.from('guestbook-images').getPublicUrl(path);
      imageUrl = pub.publicUrl;
    }

    const { data, error } = await client.rpc('create_post', {
      p_message: message,
      p_image_url: imageUrl,
      p_passcode: passcode,
    });
    if (error || !data) {
      els.postSubmitBtn.disabled = false;
      els.postFormMsg.textContent = '게시에 실패했어요. 비밀번호를 확인해주세요.';
      return;
    }
  }

  els.postSubmitBtn.disabled = false;
  els.postForm.reset();
  els.postCharCount.textContent = '0 / 280';
  clearPostMediaSelection();
  await loadPosts();
});

els.posts.addEventListener('click', async (e) => {
  const delBtn = e.target.closest('.post-del');
  if (!delBtn) return;
  const id = Number(delBtn.dataset.id);
  const passcode = window.prompt('삭제하려면 관리자 비밀번호를 입력하세요.');
  if (!passcode) return;

  if (DEMO_MODE) {
    if (passcode !== DEMO_PASSCODE) {
      alert('비밀번호가 올바르지 않아요.');
      return;
    }
    demoSavePosts(demoLoadPosts().filter((row) => row.id !== id));
    await loadPosts();
    return;
  }

  const { data, error } = await client.rpc('delete_post', { p_id: id, p_passcode: passcode });
  if (error || !data) {
    alert('삭제하지 못했어요. 비밀번호를 확인해주세요.');
    return;
  }
  await loadPosts();
});

/* ---- profile edit ---- */

let selectedAvatarFile = null;
let avatarRemoved = false;

function setAvatarPreview(url) {
  if (url) {
    els.fAvatarPreviewImg.src = url;
    els.fAvatarPreviewImg.hidden = false;
    els.fAvatarEmptyText.hidden = true;
    els.fAvatarRemoveBtn.hidden = false;
  } else {
    els.fAvatarPreviewImg.src = '';
    els.fAvatarPreviewImg.hidden = true;
    els.fAvatarEmptyText.hidden = false;
    els.fAvatarRemoveBtn.hidden = true;
  }
}

els.fAvatarPickBtn.addEventListener('click', () => els.fAvatarInput.click());

els.fAvatarInput.addEventListener('change', () => {
  const file = els.fAvatarInput.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    els.editMsg.textContent = '이미지는 5MB 이하로 올려주세요.';
    els.fAvatarInput.value = '';
    return;
  }
  els.editMsg.textContent = '';
  selectedAvatarFile = file;
  avatarRemoved = false;
  const reader = new FileReader();
  reader.onload = () => setAvatarPreview(reader.result);
  reader.readAsDataURL(file);
});

els.fAvatarRemoveBtn.addEventListener('click', () => {
  selectedAvatarFile = null;
  avatarRemoved = true;
  els.fAvatarInput.value = '';
  setAvatarPreview('');
});

let selectedCoverFile = null;
let coverRemoved = false;

function setCoverPreview(url) {
  if (url) {
    els.fCoverPreviewImg.src = url;
    els.fCoverPreviewImg.hidden = false;
    els.fCoverEmptyText.hidden = true;
    els.fCoverRemoveBtn.hidden = false;
  } else {
    els.fCoverPreviewImg.src = '';
    els.fCoverPreviewImg.hidden = true;
    els.fCoverEmptyText.hidden = false;
    els.fCoverRemoveBtn.hidden = true;
  }
}

els.fCoverPickBtn.addEventListener('click', () => els.fCoverInput.click());

els.fCoverInput.addEventListener('change', () => {
  const file = els.fCoverInput.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    els.editMsg.textContent = '이미지는 5MB 이하로 올려주세요.';
    els.fCoverInput.value = '';
    return;
  }
  els.editMsg.textContent = '';
  selectedCoverFile = file;
  coverRemoved = false;
  const reader = new FileReader();
  reader.onload = () => setCoverPreview(reader.result);
  reader.readAsDataURL(file);
});

els.fCoverRemoveBtn.addEventListener('click', () => {
  selectedCoverFile = null;
  coverRemoved = true;
  els.fCoverInput.value = '';
  setCoverPreview('');
});

function openEditPanel() {
  if (currentProfile) {
    els.fName.value = currentProfile.name || '';
    els.fHandle.value = currentProfile.handle || '';
    els.fBio.value = currentProfile.bio || '';
    els.fLocation.value = currentProfile.location || '';
    els.fJoined.value = currentProfile.joined_label || '';
    setAvatarPreview(currentProfile.avatar_url || '');
    setCoverPreview(currentProfile.cover_url || '');
  }
  selectedAvatarFile = null;
  avatarRemoved = false;
  els.fAvatarInput.value = '';
  selectedCoverFile = null;
  coverRemoved = false;
  els.fCoverInput.value = '';
  els.fPasscode.value = '';
  els.editMsg.textContent = '';
  els.editMsg.classList.remove('ok');
  els.editOverlay.hidden = false;
  els.fName.focus();
}

function closeEditPanel() {
  els.editOverlay.hidden = true;
}

els.editOpenBtn.addEventListener('click', openEditPanel);
els.editCloseBtn.addEventListener('click', closeEditPanel);
els.editCancelBtn.addEventListener('click', closeEditPanel);
els.editOverlay.addEventListener('click', (e) => {
  if (e.target === els.editOverlay) closeEditPanel();
});

els.editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const passcode = els.fPasscode.value;
  if (!passcode) {
    els.editMsg.textContent = '편집 비밀번호를 입력해주세요.';
    return;
  }

  els.editSaveBtn.disabled = true;
  els.editMsg.textContent = '';
  els.editMsg.classList.remove('ok');

  let avatarUrl = currentProfile?.avatar_url || '';
  if (avatarRemoved) avatarUrl = '';

  if (selectedAvatarFile) {
    if (DEMO_MODE) {
      avatarUrl = els.fAvatarPreviewImg.src;
    } else {
      const ext = (selectedAvatarFile.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `avatar/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await client.storage.from('guestbook-images').upload(path, selectedAvatarFile);
      if (uploadError) {
        console.error(uploadError);
        els.editSaveBtn.disabled = false;
        els.editMsg.textContent = '프로필 사진 업로드에 실패했어요. 잠시 후 다시 시도해주세요.';
        return;
      }
      const { data: pub } = client.storage.from('guestbook-images').getPublicUrl(path);
      avatarUrl = pub.publicUrl;
    }
  }

  let coverUrl = currentProfile?.cover_url || '';
  if (coverRemoved) coverUrl = '';

  if (selectedCoverFile) {
    if (DEMO_MODE) {
      coverUrl = els.fCoverPreviewImg.src;
    } else {
      const ext = (selectedCoverFile.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `cover/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await client.storage.from('guestbook-images').upload(path, selectedCoverFile);
      if (uploadError) {
        console.error(uploadError);
        els.editSaveBtn.disabled = false;
        els.editMsg.textContent = '배경 사진 업로드에 실패했어요. 잠시 후 다시 시도해주세요.';
        return;
      }
      const { data: pub } = client.storage.from('guestbook-images').getPublicUrl(path);
      coverUrl = pub.publicUrl;
    }
  }

  const nextProfile = {
    name: els.fName.value.trim(),
    handle: els.fHandle.value.trim().replace(/^@/, ''),
    bio: els.fBio.value.trim(),
    location: els.fLocation.value.trim(),
    avatar_url: avatarUrl,
    cover_url: coverUrl,
    joined_label: els.fJoined.value.trim(),
  };

  if (DEMO_MODE) {
    els.editSaveBtn.disabled = false;
    if (passcode !== DEMO_PASSCODE) {
      els.editMsg.textContent = `비밀번호가 올바르지 않아요. (데모 비밀번호: ${DEMO_PASSCODE})`;
      return;
    }
    demoSaveProfile(nextProfile);
    els.editMsg.textContent = '저장되었어요.';
    els.editMsg.classList.add('ok');
    await loadProfile();
    setTimeout(closeEditPanel, 600);
    return;
  }

  const { data, error } = await client.rpc('update_profile', {
    p_name: nextProfile.name,
    p_handle: nextProfile.handle,
    p_bio: nextProfile.bio,
    p_location: nextProfile.location,
    p_avatar_url: nextProfile.avatar_url,
    p_cover_url: nextProfile.cover_url,
    p_joined_label: nextProfile.joined_label,
    p_passcode: passcode,
  });

  els.editSaveBtn.disabled = false;

  if (error) {
    console.error(error);
    els.editMsg.textContent = '저장에 실패했어요. 잠시 후 다시 시도해주세요.';
    return;
  }
  if (!data) {
    els.editMsg.textContent = '비밀번호가 올바르지 않아요.';
    return;
  }

  els.editMsg.textContent = '저장되었어요.';
  els.editMsg.classList.add('ok');
  await loadProfile();
  setTimeout(closeEditPanel, 600);
});

if (DEMO_MODE) {
  const banner = document.createElement('div');
  banner.textContent = `데모 모드 · 이 브라우저에만 저장돼요 (관리자 비밀번호: ${DEMO_PASSCODE}) · 실제 배포는 SETUP.md 참고`;
  banner.style.cssText = 'max-width:460px;margin:0 auto 10px;padding:8px 14px;border-radius:10px;background:var(--accent-tint);color:var(--accent-strong);font-size:12px;font-weight:600;text-align:center;';
  document.body.insertBefore(banner, document.querySelector('.page'));
}

applyAdminVisibility();
loadProfile();
loadEntries();
loadPosts();
loadPlaylist();
