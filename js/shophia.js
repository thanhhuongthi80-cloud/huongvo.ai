// ---------- Hương Shophia — standalone page logic (separate from js/auth.js) ----------
(function(){
  const STORAGE_KEY = 'sp_user';
  const LANG_KEY = 'sp_lang';

  // Reuses the same deployed Apps Script webapp as the Chìa Khóa Tự Do site
  // (see google-sheet/huong-dan-thiet-lap.md) so sign-ups land in one sheet.
  // Rows are tagged type/page so they're easy to filter separately.
  const SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzDDaB7d0ZZjsnDb3IfL9VRU7nYqdqheakmffafdd8Ew2N4WriuwPYqmaqbAONmPCb8iQ/exec';

  function logToSheet(payload){
    if (!SHEET_WEBAPP_URL) return;
    try {
      fetch(SHEET_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(Object.assign({ page: location.pathname }, payload))
      }).catch(() => {});
    } catch (e) {}
  }

  const DICT = {
    vi: {
      nav_author: 'Tác Giả',
      nav_beginners: 'Người Mới',
      nav_manifesto: 'Tuyên Ngôn',
      nav_start: 'Bắt Đầu',
      nav_affiliate: 'Cộng Tác Viên',
      beg_eyebrow: 'Người Mới Bắt Đầu',
      beg_h2: 'Chưa biết gì về AI? Không sao cả.',
      beg_sub: 'Lộ trình này thiết kế cho người thật sự mới — không kỹ thuật, không thuật ngữ khó hiểu.',
      strip_role: 'Đại Sứ Thương Hiệu của các AI tại Việt Nam',
      author_eyebrow: 'Tác Giả',
      author_name: 'Hương Shophia',
      author_lead: '"Từ một người phụ nữ như bao người phụ nữ khác, tôi chọn học AI để tự viết lại câu chuyện đời mình."',
      author_caption: '"Một người phụ nữ Việt hiện đại: bước qua đổ nát, đứng lên từ số không, để rồi nhận ra tự do không phải là có bao nhiêu lối rẽ, mà là có đủ dữ liệu để tự vẽ lối đi cho chính mình."',
      author_p1: 'Sinh ra và lớn lên như bao người phụ nữ Việt khác — cũng từng loay hoay giữa công việc, gia đình và những giới hạn tuổi tác. Ở tuổi 40, Hương Shophia chọn một con đường khác: học AI, không phải để chạy theo công nghệ, mà để giành lại quyền tự chủ cuộc đời mình.',
      author_p2: 'Từ những buổi Zoom đầu tiên chỉ vài người tham gia, đến nay Hương Shophia đã đồng hành cùng hơn 1000 phụ nữ 35–50 tuổi bước vào kỷ nguyên AI — không cần giỏi công nghệ, chỉ cần dám bắt đầu.',
      author_cta: 'Tham Gia Cùng Hương Shophia',
      beg1_title: 'Không cần biết công nghệ',
      beg1_text: 'Bạn chỉ cần biết dùng điện thoại nhắn tin là đủ. Mọi thứ còn lại, AI và Hương Shophia lo.',
      beg2_title: 'Không cần nhiều thời gian',
      beg2_text: 'Mỗi tuần chỉ 1 buổi Zoom 60 phút — vừa đủ để học, vừa đủ để không quá tải.',
      beg3_title: 'Không giới hạn tuổi tác',
      beg3_text: 'Học viên từ 35 đến 55 tuổi. Ai cũng bắt đầu lại được, không bao giờ là muộn.',
      beg4_title: 'Không cần vốn ban đầu',
      beg4_text: 'Buổi đầu tiên hoàn toàn miễn phí. Bạn chỉ cần một quyết định: có mặt.',
      btn_register: 'Đăng Ký',
      logout_btn: 'Đăng xuất',
      hero_badge: 'Hành Trình Mới · Phụ Nữ & AI',
      hero_title: 'PHỤ NỮ THỜI NAY<br>TỰ CHỦ ĐỜI',
      hero_poem: '"Chẳng còn lụi cụi như xưa,<br>Data, cốt truyện, nắng mưa chẳng màng.<br>AI trợ lý nhịp nhàng,<br>Hồng nhan làm chủ, rõ ràng công danh."',
      hero_desc: 'Cùng <strong>Hương Shophia</strong> — 40 tuổi, người phụ nữ chọn bước vào kỷ nguyên AI bằng đôi chân của chính mình.',
      hero_pill: '20:00 — Zoom hàng tuần',
      hero_quote_kicker: 'Hương Shophia · 40',
      hero_quote: '"Chẳng còn lụi cụi như xưa,<br>Data, cốt truyện, nắng mưa chẳng màng.<br>AI trợ lý nhịp nhàng,<br>Hồng nhan làm chủ, rõ ràng công danh."',
      manifesto_eyebrow: 'Tuyên Ngôn',
      manifesto_h2: 'Bản lĩnh phụ nữ ngày nay,<br>Làm chủ cuộc sống, dựng xây phong trào.',
      manifesto_sub: 'Bà của chúng ta đã gánh nước, ra trận, dựng nhà. Đến lượt chúng ta — chỉ cần học AI.',
      m1_title: 'Phụ nữ tự chủ cuộc đời',
      m1_text: 'Tự do tài chính, tự do thời gian, tự do lựa chọn — bắt đầu từ chính bạn.',
      m2_title: 'Gian lao, bom đạn chẳng phai',
      m2_text: 'Bà ta từng ra trận giữ nước. Một chiếc điện thoại và AI — chuyện nhỏ.',
      m3_title: 'Nền tảng công nghệ, sáng ngời tương lai',
      m3_text: 'AI không phải dành cho người trẻ — AI dành cho người dám học, dám làm.',
      m4_title: 'Sá gì đổi mới, quản tài quản công!',
      m4_text: 'Không cần code, không cần vốn. Chỉ cần một quyết định: bắt đầu hôm nay.',
      manifesto_link: 'Đọc tiếp →',
      back_home: '← Quay lại trang chủ',
      next_manifesto: 'Tuyên ngôn tiếp theo',
      art1_eyebrow: 'Tuyên Ngôn 01',
      art1_p1: 'Nhiều phụ nữ dành cả đời chăm lo cho chồng con, gia đình, công việc — và quên mất câu hỏi quan trọng nhất: còn tôi thì sao? Tự chủ cuộc đời không phải là ích kỷ, mà là điều kiện để bạn có thể cho đi nhiều hơn, bền vững hơn.',
      art1_p2: 'AI là công cụ đầu tiên trong lịch sử cho phép một người phụ nữ bận rộn — vừa làm mẹ, vừa đi làm, vừa chăm nhà — vẫn có thể tạo ra một nguồn thu nhập riêng, mà không cần bỏ việc, không cần vốn lớn, không cần học nhiều năm.',
      art1_p3: 'Trong lớp học của Hương Shophia, có người mẹ hai con chỉ sau 3 buổi Zoom đã tự viết được nội dung bán hàng cho shop nhà mình; có người phụ nữ 47 tuổi lần đầu cảm thấy mình được trân trọng vì những gì mình làm ra, không phải vì mình phục vụ ai.',
      art1_closing: 'Tự chủ bắt đầu từ một quyết định nhỏ: dành ra 60 phút mỗi tuần cho chính mình.',
      art2_eyebrow: 'Tuyên Ngôn 02',
      art2_p1: 'Thế hệ bà, thế hệ mẹ chúng ta đã gánh nước qua bom đạn, đã một mình nuôi con giữa chiến tranh, đã dựng nhà từ hai bàn tay trắng. So với những gì họ đã vượt qua, việc học cách gõ một câu hỏi vào ô chat AI thực sự không phải là điều gì quá sức.',
      art2_p2: 'Nỗi sợ công nghệ phần lớn đến từ cảm giác "mình không thuộc về nơi này" — nhưng AI hiện đại được thiết kế để nói chuyện như con người, không đòi hỏi bạn phải biết thuật ngữ kỹ thuật. Bạn chỉ cần biết mình muốn gì, và diễn đạt nó bằng chính ngôn ngữ đời thường của mình.',
      art2_p3: 'Nhiều học viên của Hương Shophia ở độ tuổi 45-55 chia sẻ rằng: sau buổi đầu tiên, nỗi sợ lớn nhất — sợ mình quá già để học cái mới — đã biến mất. Không phải vì công nghệ dễ, mà vì họ nhận ra mình chưa bao giờ thực sự yếu đuối.',
      art2_closing: 'Nếu bạn đã từng vượt qua những điều khó hơn thế này, thì đây chỉ là một bước nhỏ tiếp theo.',
      art3_eyebrow: 'Tuyên Ngôn 03',
      art3_p1: 'Có một hiểu lầm phổ biến: công nghệ là sân chơi của người trẻ, còn phụ nữ trung niên chỉ có thể đứng nhìn. Thực tế ngược lại — AI hiện đại được xây dựng để bất kỳ ai, ở bất kỳ độ tuổi nào, cũng có thể sử dụng chỉ bằng ngôn ngữ tự nhiên.',
      art3_p2: 'Bạn không cần biết lập trình, không cần hiểu thuật toán. Bạn chỉ cần biết diễn đạt điều mình muốn — giống như đang nhờ một trợ lý riêng. AI sẽ lo phần còn lại: viết bài, thiết kế ảnh, lên kịch bản, trả lời khách hàng.',
      art3_p3: 'Lộ trình học tại lớp của Hương Shophia được thiết kế theo từng bước nhỏ, mỗi tuần một kỹ năng, không dồn ép, không thuật ngữ khó hiểu — để ai cũng có thể theo kịp, dù chưa từng chạm vào công nghệ.',
      art3_closing: 'Nền tảng vững chắc không đến từ việc học nhanh, mà từ việc học đúng cách, đúng nhịp của mình.',
      art4_eyebrow: 'Tuyên Ngôn 04',
      art4_p1: 'Nhiều người trì hoãn việc bắt đầu vì nghĩ mình cần vốn lớn, cần một đội ngũ, cần thời gian rảnh rỗi. Nhưng AI đã thay đổi luật chơi: một người phụ nữ, một chiếc điện thoại, và một buổi Zoom miễn phí — đủ để bắt đầu.',
      art4_p2: 'Không cần bỏ công việc hiện tại. Không cần đầu tư ban đầu. Bạn có thể học vào buổi tối, áp dụng ngay vào công việc kinh doanh nhỏ, công việc văn phòng, hay đơn giản là để tiết kiệm thời gian cho gia đình.',
      art4_p3: 'Nhiều học viên bắt đầu chỉ với mục tiêu nhỏ — viết caption bán hàng nhanh hơn — rồi dần dần mở rộng thành một nguồn thu nhập phụ ổn định, thậm chí thay thế cả công việc chính.',
      art4_closing: 'Đổi mới không đáng sợ. Đáng sợ nhất là đứng yên trong khi thế giới đã đổi thay.',
      stat1_num: '40+', stat1_label: 'Tuổi vẫn dẫn đầu',
      stat2_num: '1000+', stat2_label: 'Phụ nữ đã tham gia',
      stat3_num: '20:00', stat3_label: 'Zoom hàng tuần',
      stat4_num: '0đ', stat4_label: 'Phí buổi đầu tiên',
      steps_eyebrow: '3 Bước Bắt Đầu',
      steps_h2: 'Hành trình của bạn — bắt đầu hôm nay',
      step1_title: 'Tham gia Zoom hàng tuần',
      step1_text: '20:00 hàng tuần. Gặp Hương Shophia trực tiếp, hỏi gì cũng trả lời.',
      step2_title: 'Nhận lộ trình AI cá nhân',
      step2_text: 'Phụ nữ 35–50 tuổi học AI theo đúng nhịp của mình — không áp lực.',
      step3_title: 'Làm chủ thu nhập mới',
      step3_text: 'Biến kỹ năng AI thành nguồn thu nhập thật — bền vững và phát triển.',
      steps_cta: 'Đặt Chỗ Zoom Miễn Phí',
      aff_toggle: '🤝 Chương Trình Đại Sứ — Kiếm thu nhập cùng Hương Shophia',
      aff1_title: 'Mời bạn tham gia Zoom',
      aff1_text: 'Nhận thưởng khi người bạn giới thiệu tham gia buổi Zoom đầu tiên.',
      aff2_title: 'Khóa học AI trọn gói',
      aff2_text: 'Hoa hồng lên đến 40% giá trị đơn hàng khi khách đăng ký khóa học AI trọn gói.',
      aff_cta: 'Đăng Ký Làm Đại Sứ',
      aff_note: 'Hoa hồng được đối soát và thanh toán hàng tuần qua chuyển khoản ngân hàng.',
      aff_copy_link: 'Sao chép link',
      aff_link_note: 'Đây là link giới thiệu riêng của bạn. Chia sẻ link này — mọi người đăng ký qua link sẽ được ghi nhận cho bạn.',
      testi_eyebrow: 'Chị Em Đã Đi Cùng',
      testi_h2: 'Họ đã bắt đầu — đến lượt bạn',
      final_h2: 'Bạn muốn đứng ngoài hay bắt đầu ngay hôm nay',
      final_text: 'Đặt chỗ buổi Zoom tới cùng Hương Shophia. Miễn phí — chỉ cần bạn dám có mặt.',
      final_zalo: 'Nhắn Zalo Hương',
      final_note: 'Không spam · Không phí ẩn · Hủy bất cứ lúc nào',
      footer_text: '© 2026 Hương Shophia · Phụ nữ làm chủ cuộc đời cùng AI',
      reg_title: 'Đăng Ký Miễn Phí',
      reg_sub: 'Đặt chỗ buổi Zoom cùng Hương Shophia — miễn phí buổi đầu tiên.',
      reg_name: 'Họ và tên',
      reg_phone: 'Số điện thoại',
      reg_submit: 'Đăng Ký Ngay',
      reg_note: 'Miễn phí · Không cần thẻ tín dụng',
    },
    en: {
      nav_author: 'Author',
      nav_beginners: 'Newcomers',
      nav_manifesto: 'Manifesto',
      nav_start: 'Get Started',
      nav_affiliate: 'Affiliate',
      beg_eyebrow: 'New Here?',
      beg_h2: "Don't know anything about AI? That's fine.",
      beg_sub: 'This path is designed for true beginners — no jargon, no tech skills required.',
      strip_role: 'Brand Ambassador for AI Platforms in Vietnam',
      author_eyebrow: 'Author',
      author_name: 'Hương Shophia',
      author_lead: '"Just a woman like any other, I chose to learn AI to rewrite my own story."',
      author_caption: '"A modern Vietnamese woman: she walked through ruin, rose up from zero, and came to realize that freedom isn\'t about how many paths there are, but about having enough data to draw your own."',
      author_p1: 'Born and raised like any other Vietnamese woman — once caught between work, family, and the limits of age. At 40, Hương Shophia chose a different path: learning AI, not to chase technology, but to reclaim ownership of her own life.',
      author_p2: 'From the first Zoom sessions with just a handful of attendees, Hương Shophia has now guided over 1,000 women aged 35–50 into the AI era — no tech skills required, just the courage to start.',
      author_cta: 'Join Hương Shophia',
      beg1_title: 'No tech skills needed',
      beg1_text: 'If you can text on your phone, that\'s enough. AI and Hương Shophia handle the rest.',
      beg2_title: 'No big time commitment',
      beg2_text: 'Just one 60-minute Zoom session a week — enough to learn, not enough to overwhelm.',
      beg3_title: 'No age limit',
      beg3_text: 'Members range from 35 to 55. Anyone can start over — it\'s never too late.',
      beg4_title: 'No starting capital',
      beg4_text: 'Your first session is completely free. All you need is one decision: show up.',
      btn_register: 'Sign Up',
      logout_btn: 'Log out',
      hero_badge: 'A New Journey · Women & AI',
      hero_title: 'MODERN WOMEN<br>MASTER THEIR OWN LIFE',
      hero_poem: '"No more grinding the old way,<br>data and storylines, rain or shine.<br>AI assists in perfect rhythm,<br>a woman in charge, clear and accomplished."',
      hero_desc: 'Join <strong>Hương Shophia</strong> — 40 years old, a woman who chose to step into the AI era on her own two feet.',
      hero_pill: '8:00 PM — Weekly on Zoom',
      hero_quote_kicker: 'Hương Shophia · 40',
      hero_quote: '"No more grinding the old way,<br>data and storylines, rain or shine.<br>AI assists in perfect rhythm,<br>a woman in charge, clear and accomplished."',
      manifesto_eyebrow: 'Manifesto',
      manifesto_h2: 'The courage of women today,<br>mastering life, building a movement.',
      manifesto_sub: 'Our grandmothers carried water, went to war, built homes. Our turn — we just need to learn AI.',
      m1_title: 'Women mastering their own life',
      m1_text: 'Financial freedom, time freedom, freedom to choose — it starts with you.',
      m2_title: 'Hardship and gunfire never broke her',
      m2_text: 'She once went to war to defend her country. A phone and AI? Nothing.',
      m3_title: 'A tech foundation for a brighter future',
      m3_text: 'AI isn\'t just for the young — it\'s for those who dare to learn, dare to act.',
      m4_title: 'Innovation is nothing — take charge of your finances!',
      m4_text: 'No coding, no capital needed. Just one decision: start today.',
      manifesto_link: 'Continue reading →',
      back_home: '← Back to home',
      next_manifesto: 'Next manifesto',
      art1_eyebrow: 'Manifesto 01',
      art1_p1: 'Many women spend their whole lives caring for their husband, children, family, and work — forgetting the most important question: what about me? Taking charge of your life isn\'t selfish — it\'s what lets you give more, sustainably.',
      art1_p2: 'AI is the first tool in history that lets a busy woman — a mother, an employee, a homemaker — build her own income stream without quitting her job, without big capital, without years of study.',
      art1_p3: 'In Hương Shophia\'s class, a mother of two wrote her own sales content for her shop after just 3 Zoom sessions; a 47-year-old woman felt valued for what she creates for the first time — not for who she serves.',
      art1_closing: 'Taking charge starts with one small decision: 60 minutes a week for yourself.',
      art2_eyebrow: 'Manifesto 02',
      art2_p1: 'Our grandmothers and mothers carried water through bombs, raised children alone through war, built homes from nothing. Compared to what they endured, learning to type a question into an AI chat box really isn\'t that hard.',
      art2_p2: 'Fear of technology mostly comes from feeling like "this isn\'t for me" — but modern AI is built to talk like a human, no technical jargon required. You just need to know what you want and say it in your own everyday words.',
      art2_p3: 'Many of Hương Shophia\'s students aged 45-55 say that after the first session, their biggest fear — being too old to learn something new — simply disappeared. Not because the technology is easy, but because they realized they were never truly weak.',
      art2_closing: 'If you\'ve overcome harder things than this, this is just the next small step.',
      art3_eyebrow: 'Manifesto 03',
      art3_p1: 'There\'s a common misconception: technology is a young person\'s game, and midlife women can only watch from the sidelines. The opposite is true — modern AI is built so anyone, at any age, can use it in plain language.',
      art3_p2: 'You don\'t need to know how to code or understand algorithms. You just need to describe what you want — like asking a personal assistant. AI handles the rest: writing, image design, scripting, customer replies.',
      art3_p3: 'Hương Shophia\'s course is designed in small steps, one skill a week, no cramming, no confusing jargon — so anyone can keep up, even if they\'ve never touched technology before.',
      art3_closing: 'A solid foundation doesn\'t come from learning fast — it comes from learning right, at your own pace.',
      art4_eyebrow: 'Manifesto 04',
      art4_p1: 'Many people delay starting because they think they need big capital, a team, or free time. But AI changed the rules: one woman, one phone, and a free Zoom session — that\'s enough to start.',
      art4_p2: 'No need to quit your job. No upfront investment. You can learn in the evening and apply it right away — to a small business, office work, or simply to save time for your family.',
      art4_p3: 'Many students start with a small goal — writing sales captions faster — then gradually grow it into a steady side income, sometimes even replacing their main job.',
      art4_closing: 'Innovation isn\'t scary. What\'s scary is standing still while the world moves on.',
      stat1_num: '40+', stat1_label: 'Age still leading',
      stat2_num: '1000+', stat2_label: 'Women joined',
      stat3_num: '8 PM', stat3_label: 'Weekly on Zoom',
      stat4_num: '$0', stat4_label: 'First session fee',
      steps_eyebrow: '3 Steps to Start',
      steps_h2: 'Your journey — starts today',
      step1_title: 'Join the weekly Zoom',
      step1_text: '8 PM every week. Meet Hương Shophia live, ask anything.',
      step2_title: 'Get a personal AI roadmap',
      step2_text: 'Women 35–50 learn AI at their own pace — no pressure.',
      step3_title: 'Master a new income',
      step3_text: 'Turn AI skills into real income — sustainable and growing.',
      steps_cta: 'Reserve a Free Zoom Spot',
      aff_toggle: '🤝 Ambassador Program — Earn income with Hương Shophia',
      aff1_title: 'Invite a friend to Zoom',
      aff1_text: 'Get rewarded when someone you refer joins their first Zoom session.',
      aff2_title: 'Full AI course',
      aff2_text: 'Earn up to 40% commission when a referral signs up for the full AI course.',
      aff_cta: 'Become an Ambassador',
      aff_note: 'Commissions are reconciled and paid weekly via bank transfer.',
      aff_copy_link: 'Copy link',
      aff_link_note: 'This is your personal referral link. Share it — anyone who signs up through it will be credited to you.',
      testi_eyebrow: 'Women Who Joined',
      testi_h2: 'They started — your turn',
      final_h2: 'Stay on the outside, or start today',
      final_text: 'Reserve your spot for the next Zoom with Hương Shophia. Free — just show up.',
      final_zalo: 'Message Hương on Zalo',
      final_note: 'No spam · No hidden fees · Cancel anytime',
      footer_text: '© 2026 Hương Shophia · Women mastering life with AI',
      reg_title: 'Free Sign Up',
      reg_sub: 'Reserve your spot for the next Zoom with Hương Shophia — free first session.',
      reg_name: 'Full name',
      reg_phone: 'Phone number',
      reg_submit: 'Sign Up Now',
      reg_note: 'Free · No credit card required',
    }
  };

  function applyLang(lang){
    if (!DICT[lang]) lang = 'vi';
    document.querySelectorAll('[data-sp-i18n]').forEach(el => {
      const val = DICT[lang][el.dataset.spI18n];
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('.sp-lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
  }

  function getUser(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e){ return null; }
  }

  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function initials(name){
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'HS';
    const first = parts[0][0] || 'H';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0][1] || 'S');
    return (first + last).toUpperCase();
  }

  function genRefCode(name){
    const base = (name || 'ds')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z]/g, '')
      .slice(0, 6) || 'ds';
    const rand = Math.floor(10000 + Math.random() * 90000);
    return base + rand;
  }

  function refLinkFor(code){
    return location.origin + location.pathname + '?ref=' + code;
  }

  function wireCopy(btn, getText){
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(getText());
        const original = btn.textContent;
        btn.textContent = (localStorage.getItem(LANG_KEY) === 'en') ? 'Copied' : 'Đã chép';
        setTimeout(() => { btn.textContent = original; }, 1500);
      } catch (e) {}
    });
  }

  (function captureRef(){
    const ref = new URLSearchParams(location.search).get('ref');
    if (ref) localStorage.setItem('sp_ref', ref);
  })();

  function openModal(){
    const modal = document.getElementById('spRegisterModal');
    if (modal) modal.classList.add('open');
  }
  function closeModal(){
    const modal = document.getElementById('spRegisterModal');
    if (modal) modal.classList.remove('open');
  }

  function renderAffiliatePanel(){
    const cta = document.getElementById('spAffiliateCta');
    if (!cta) return;
    const user = getUser();
    const lang = localStorage.getItem(LANG_KEY) || 'vi';

    if (user) {
      if (!user.refCode) {
        user.refCode = genRefCode(user.name);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
      const link = refLinkFor(user.refCode);
      cta.innerHTML =
        '<div class="sp-ref-row">' +
          '<input type="text" readonly id="spMyRefLink" value="' + escapeHtml(link) + '">' +
          '<button type="button" class="sp-btn sp-btn-primary" id="spCopyMyRefBtn">' + DICT[lang].aff_copy_link + '</button>' +
        '</div>' +
        '<p class="sp-aff-note">' + DICT[lang].aff_link_note + '</p>';
      wireCopy(document.getElementById('spCopyMyRefBtn'), () => document.getElementById('spMyRefLink').value);
    } else {
      cta.innerHTML = '<button type="button" class="sp-btn sp-btn-primary" id="spOpenRegisterAff">' + DICT[lang].aff_cta + '</button>';
      document.getElementById('spOpenRegisterAff').addEventListener('click', openModal);
    }
  }

  function renderAuthSlot(){
    const slot = document.getElementById('spAuthSlot');
    if (!slot) return;
    const user = getUser();
    const lang = localStorage.getItem(LANG_KEY) || 'vi';

    if (user) {
      slot.innerHTML =
        '<div class="sp-user-chip" id="spUserChip">' +
          '<div class="sp-avatar">' + escapeHtml(initials(user.name)) + '</div>' +
          '<div class="sp-user-meta">' +
            '<span class="sp-user-name">' + escapeHtml((user.name || 'Bạn').split(/\s+/)[0]) + '</span>' +
            '<span class="sp-user-tag">Free</span>' +
          '</div>' +
          '<div class="sp-user-dropdown"><button type="button" id="spLogoutBtn">' + DICT[lang].logout_btn + '</button></div>' +
        '</div>';

      const chip = document.getElementById('spUserChip');
      chip.addEventListener('click', (e) => {
        if (e.target.id === 'spLogoutBtn') return;
        chip.classList.toggle('open');
      });
      document.getElementById('spLogoutBtn').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        renderAuthSlot();
        renderAffiliatePanel();
      });
      document.addEventListener('click', (e) => {
        if (!chip.contains(e.target)) chip.classList.remove('open');
      });
    } else {
      slot.innerHTML = '<button type="button" class="sp-btn-register" id="spOpenRegister">' + DICT[lang].btn_register + '</button>';
      document.getElementById('spOpenRegister').addEventListener('click', openModal);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(localStorage.getItem(LANG_KEY) || 'vi');
    document.querySelectorAll('.sp-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLang(btn.dataset.lang);
        renderAuthSlot();
        renderAffiliatePanel();
      });
    });

    renderAuthSlot();
    renderAffiliatePanel();

    const hamburger = document.getElementById('spHamburger');
    const navLinks = document.getElementById('spNavLinks');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
      });
    }

    const affToggle = document.getElementById('spAffiliateToggle');
    const affPanel = document.getElementById('spAffiliatePanel');
    if (affToggle && affPanel) {
      affToggle.addEventListener('click', () => {
        affToggle.classList.toggle('open');
        affPanel.classList.toggle('open');
      });
    }

    const modal = document.getElementById('spRegisterModal');
    const closeBtn = document.getElementById('spModalClose');
    const form = document.getElementById('spRegisterForm');

    document.querySelectorAll('.js-sp-open-register').forEach((btn) => {
      btn.addEventListener('click', openModal);
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('spRegName').value.trim();
        const phone = document.getElementById('spRegPhone').value.trim();
        if (!name || !phone) return;
        const refCode = genRefCode(name);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, phone, refCode }));
        logToSheet({ type: 'dang_ky_shophia', name, phone, refCode });
        closeModal();
        form.reset();
        renderAuthSlot();
        renderAffiliatePanel();
      });
    }
  });
})();
