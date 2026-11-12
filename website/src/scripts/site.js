const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  let mode = document.documentElement.dataset.mode || 'auto';
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'giờ trên thiết bị';
  function applyTheme() {
    const hour = new Date().getHours();
    const theme = mode === 'auto' ? (hour >= 6 && hour < 18 ? 'light' : 'dark') : mode;
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mode = mode;
    $('#theme-icon').setAttribute('href', theme === 'dark' ? '#moon' : '#sun');
    $('#theme-toggle').setAttribute('aria-label', `Chọn giao diện, hiện tại ${theme === 'dark' ? 'tối' : 'sáng'}${mode === 'auto' ? ', tự động theo giờ địa phương' : ''}`);
    $$('.theme-option').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    $('#theme-status').textContent = mode === 'auto' ? `Tự động · ${zone} · ${theme === 'dark' ? 'Buổi tối' : 'Ban ngày'}` : `Giao diện ${theme === 'dark' ? 'tối' : 'sáng'} · Bạn đã chọn`;
  }
  function closeTheme() { $('#theme-popup').hidden = true; $('#theme-toggle').setAttribute('aria-expanded', 'false'); }
  $('#theme-toggle').addEventListener('click', () => { const open = $('#theme-popup').hidden; $('#theme-popup').hidden = !open; $('#theme-toggle').setAttribute('aria-expanded', String(open)); if (open) $('.theme-option[aria-pressed="true"]').focus(); });
  $$('.theme-option').forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; try { localStorage.setItem('tung-blog-theme', mode); } catch {} applyTheme(); closeTheme(); $('#theme-toggle').focus(); }));
  document.addEventListener('click', e => { if (!e.target.closest('.theme')) closeTheme(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#theme-popup').hidden) { closeTheme(); $('#theme-toggle').focus(); } });
  window.addEventListener('focus', applyTheme);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) applyTheme(); });
  window.addEventListener('storage', e => { if (e.key === 'tung-blog-theme') { mode = ['auto','light','dark'].includes(e.newValue) ? e.newValue : 'auto'; applyTheme(); } });
  setInterval(applyTheme, 60000); applyTheme();
  function filterPosts(category) {
    $$('.filter').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === category)));
    $$('.post').forEach(p => p.hidden = category !== 'all' && p.dataset.category !== category);
    const count = $$('.post:not([hidden])').length;
    $('#post-count').textContent = String(count).padStart(2,'0'); $('#no-results').hidden = count > 0;
  }
  $$('.filter').forEach(b => b.addEventListener('click', () => filterPosts(b.dataset.filter)));
  $$('[data-topic]').forEach(a => a.addEventListener('click', () => filterPosts(a.dataset.topic)));

const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
let searchData;let sequence=0;
async function renderSearch(){
 const mine=++sequence,results=$('#search-results');results.textContent='Đang tải bài viết…';
 try{if(!searchData){const r=await fetch('/search.json');if(!r.ok)throw Error();searchData=await r.json();}
 if(mine!==sequence)return;
 const q=normalize($('#search-input').value.trim());results.replaceChildren();
 searchData.filter(a=>normalize(a.title+' '+a.description+' '+a.category).includes(q)).forEach(a=>{
 const link=document.createElement('a');link.href=a.url;link.className='search-result';link.textContent=a.title;const small=document.createElement('small');small.textContent=a.category;link.append(small);results.append(link);});
 if(!results.children.length)results.textContent='Chưa tìm thấy bài phù hợp. Bạn thử từ khóa khác nhé.';
 }catch{if(mine===sequence)results.textContent='Chưa tải được bài viết. Bạn thử lại nhé.';}
}
$('#search-open').addEventListener('click',()=>{renderSearch();$('#search-dialog').showModal();$('#search-input').focus();});
$('#search-input').addEventListener('input',renderSearch);
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
