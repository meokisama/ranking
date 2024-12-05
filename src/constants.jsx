const ROUTES = {
  HOME: "/",
  VOTE: "/vote",
  LEADERBOARD: "/leaderboard",
};

const SOCIAL = { facebook: "https://www.facebook.com/vnlnr" };

const INTRODUCTION_INFO = [
  {
    title: "Về Bảng Xếp Hạng",
    content: (
      <div>
        <p>
          Trong cộng đồng độc giả Light Novel, có một{" "}
          <strong>Bảng Xếp Hạng Light Novel Việt Nam</strong> tỏa sáng như một
          điểm đến tinh thần, nơi những tâm hồn đam mê văn học Nhật Bản hội tụ,
          cùng chia sẻ đam mê và khám phá những tác phẩm đình đám nhất. Hành
          trình này không chỉ là một cuộc bình chọn, mà còn là một cuộc phiêu
          lưu, một hành trình khám phá văn hóa và tinh thần, đan xen giữa sức
          sáng tạo của tác giả và niềm đam mê của độc giả.
        </p>
        <p>
          Mỗi năm, khi <strong>Bảng Xếp Hạng Light Novel Việt Nam</strong> khởi
          động, một cuộc bình chọn hoành tráng mở ra, mời gọi toàn bộ cộng đồng
          dấn thân vào cuộc hành trình tìm ra những tác phẩm vượt trội nhất,
          những câu chuyện cảm xúc nhất, những nhân vật hấp dẫn nhất.
        </p>
        <p>
          Hơn hết, <strong>Bảng Xếp Hạng Light Novel Việt Nam</strong> không chỉ
          là một sân chơi giành cho các tác phẩm, mà còn góp phần xây dựng cộng
          đồng, tạo ra một không gian văn hóa nơi mà mọi người có thể cùng nhau
          giao lưu, trao đổi, lan tỏa niềm đam mê và tận hưởng sự phong phú của
          văn học Light Novel.
        </p>
      </div>
    ),
  },
  {
    title: "Về Ban Tổ Chức",
    content: (
      <div>
        <p>
          Và đứng sau <strong>Bảng Xếp Hạng Light Novel Việt Nam</strong> chính
          là đội ngũ ban tổ chức và truyền thông, một đội ngũ đam mê và tận tâm
          dẫn đầu bởi{" "}
          <strong style={{ color: "rgb(85, 83, 83)" }}>Baka Hyddyt</strong>, là
          những người sẵn lòng bỏ thời gian và công sức để tạo ra một sân chơi
          mới, công bằng và chất lượng nhất cho cộng đồng yêu thích Light Novel.
        </p>
        <p>
          <strong style={{ color: "rgb(85, 83, 83)" }}>Hyddyt</strong> không chỉ
          là người tổ chức, mà còn là một anti romcom chúa, chiến thần harem và
          shitposter chuyên nghiệp. Với mục tiêu giúp cho mọi người có 1 cái
          nhìn đầy đủ và rõ ràng hơn về thị trường Light Novel Việt Nam.
        </p>
        <p>
          Kể từ năm 2018, ban tổ chức đã bắt đầu hành trình đầy tham vọng đó khi
          muốn đưa một <strong>Konorano/Oricon</strong> hay thứ gì đó tương tự
          tới với thị trường Việt. Trải qua nhiều thăng trầm để tạo ra một không
          gian đầy màu sắc dành cho cộng đồng yêu thích Light Novel Việt Nam nói
          riêng và những người ưa thích văn hoá Nhật Bản nói chung. Bằng tâm
          huyết và những nỗ lực không ngừng nghỉ, chúng tôi cố gắng xây dựng một
          bảng xếp hạng công bằng nơi mà mọi tác phẩm, mọi đam mê, mọi ý kiến
          góp ý và xây dựng của độc giả đều được lắng nghe và thấu hiểu.
        </p>
      </div>
    ),
  },
];

const AUTHORS = [
  {
    name: "Hyddyt",
    description: "Organizer",
    url: "https://www.facebook.com/hyddytngokngek",
  },
  {
    name: "Zennomi",
    description: "BE",
    url: "https://www.facebook.com/Zennomi",
  },
  {
    name: "Meoki",
    description: "FE",
    url: "https://www.facebook.com/TheMeoki",
  },
  {
    name: "Hyddyt",
    description: "Organizer",
    url: "https://www.facebook.com/hyddytngokngek",
  },
  {
    name: "Zennomi",
    description: "BE",
    url: "https://www.facebook.com/Zennomi",
  },
  {
    name: "Meoki",
    description: "FE",
    url: "https://www.facebook.com/TheMeoki",
  },
];

const CATEGORIES = [
  "Light Novel được yêu thích nhất",
  "Oneshot được yêu thích nhất",
  "Nhà phát hành được yêu thích nhất",
  "Light Novel tân binh của năm",
];

const TOP10 = [
  { rank: "/gold.png", src: "/images/top10/01.jpg" },
  { rank: "/silver.png", src: "/images/top10/02.jpg" },
  { rank: "/bronze.png", src: "/images/top10/03.jpg" },
  { rank: "#4", src: "/images/top10/04.jpg" },
  { rank: "#5", src: "/images/top10/05.jpg" },
  { rank: "#6", src: "/images/top10/06.jpg" },
  { rank: "#7", src: "/images/top10/07.jpg" },
  { rank: "#8", src: "/images/top10/08.jpg" },
  { rank: "#9", src: "/images/top10/09.jpg" },
  { rank: "#10", src: "/images/top10/10.jpg" },
];

const TIMELINE = [
  {
    index: "/tl01.webp",
    date: "05-14/06/2024",
    description:
      "Đăng bài phỏng vấn, PR các fandom lên dần chuẩn bị cho sự kiện.",
    position: "right",
    optional: false,
  },
  {
    index: "/tl02.webp",
    date: "10/06/2024",
    description:
      "Công bố ra mắt banner Bảng Xếp Hạng Light Novel Việt Nam nửa đầu 2024.",
    position: "left",
    optional: false,
  },
  {
    index: "/tl03.webp",
    date: "15-25/06/2024",
    description:
      "Chính thức mở bình chọn BXH LNVN nửa đầu 2024 với các hạng mục được giới thiệu ở phần tiếp theo.",
    position: "right",
    optional: true,
  },
  {
    index: "/tl04.webp",
    date: "26-29/06/2024",
    description:
      "Ban tổ chức tiến hành tổng hợp các lượt bình chọn và xử lý kết quả.",
    position: "left",
    optional: false,
  },
  {
    index: "/tl05.webp",
    date: "30/06/2024",
    description:
      "Đăng bài tổng kết bảng xếp hạng và ảnh mừng các tác phẩm đứng đầu.",
    position: "right",
    optional: false,
  },
];

const COLLAB_PAGES = [
  {
    name: "Hako.re",
    username: "hako.page",
    url: "https://www.facebook.com/hako.page",
    avatar: "/images/media/hako.webp",
  },
  {
    name: "Zennomi",
    username: "zennomi",
    url: "https://facebook.com/Zennomi",
    avatar: "/images/media/zennomi.webp",
  },
  {
    name: "Sonako Light Novel",
    username: "SonakoWiki",
    url: "https://facebook.com/SonakoWiki",
    avatar: "/images/media/sonako.webp",
  },
  {
    name: "Hội những người yêu thích Light Novel",
    username: "100064392503502",
    url: "https://www.facebook.com/profile.php?id=100064392503502",
    avatar: "/images/media/valvrare.webp",
  },
  {
    name: "Hako - Cộng đồng độc giả Light Novel VN",
    username: "hako.group",
    url: "https://www.facebook.com/hako.group",
    avatar: "/images/media/hako_group.webp",
  },
  {
    name: "Sword Art Online Vietnam",
    username: "sword.art.online.vietnam",
    url: "https://facebook.com/sword.art.online.vietnam",
    avatar: "/images/media/sao.webp",
  },
  {
    name: "LIGHT NOVEL - MANGA VIỆT NAM 2.0",
    username: "2154767871225294",
    url: "https://facebook.com/groups/2154767871225294",
    avatar: "/images/media/group2_0.webp",
  },
  {
    name: "Otonari no Tenshi-sama Fanpage Việt Nam",
    username: "OtonariVNFP",
    url: "https://www.facebook.com/OtonariVNFP",
    avatar: "/images/media/tenshi.webp",
  },
  {
    name: "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e VN Fanpage",
    username: "YoujitsuVN",
    url: "https://www.facebook.com/YoujitsuVN",
    avatar: "/images/media/youjitsu.webp",
  },
  {
    name: "Tokidoki Bosotto Roshia-go de Dereru Tonari no Arya-san Vietnam Fanpage",
    username: "RoshidereVN",
    url: "https://facebook.com/RoshidereVN",
    avatar: "/images/media/roshidere.webp",
  },
  {
    name: "Otome Game Sekai wa Mob ni Kibishii Sekai Desu Việt Nam",
    username: "MobSekaVietNam",
    url: "https://facebook.com/MobSekaVietNam",
    avatar: "/images/media/mobuseka.webp",
  },
  {
    name: "Netoge no Yome ga Ninki Idol datta Vietnam Fanpage",
    username: "NetogeVN",
    url: "https://facebook.com/NetogeVN",
    avatar: "/images/media/netoge.webp",
  },
  {
    name: "Saijo No Osewa VN Fanpage",
    username: "saijonoosewaVN",
    url: "https://facebook.com/saijonoosewaVN",
    avatar: "/images/media/saijo.webp",
  },
  {
    name: "Jaku chara Tomozaki-kun VN",
    username: "TomozakiVN",
    url: "https://facebook.com/TomozakiVN",
    avatar: "/images/media/tomozaki.webp",
  },
  {
    name: "Bunny Girl Senpai Vietnam",
    username: "BGSVietnam",
    url: "https://facebook.com/BGSVietnam",
    avatar: "/images/media/aobuta.webp",
  },
  {
    name: "Eighty Six Vietnam",
    username: "86VietNamFanpage",
    url: "https://facebook.com/86VietNamFanpage",
    avatar: "/images/media/86.webp",
  },
  {
    name: "Reryuu - Anime/2d Reviewer và Translator",
    username: "reryuu52",
    url: "https://facebook.com/reryuu52",
    avatar: "/images/media/reryuu.webp",
  },
  {
    name: "Tantei wa Mou, Shindeiru VN",
    username: "TanmoshiVN",
    url: "https://facebook.com/TanmoshiVN",
    avatar: "/images/media/tanmoshi.webp",
  },
  {
    name: "Fanpage Kura Kyoudou Việt Nam",
    username: "KuraKyoudou",
    url: "https://facebook.com/KuraKyoudou",
    avatar: "/images/media/kurakyoudou.webp",
  },
  {
    name: "Jimikawa Fanpage Việt Nam",
    username: "JimikawaFanpageVN",
    url: "https://facebook.com/JimikawaFanpageVN",
    avatar: "/images/media/jimikawa.webp",
  },
  {
    name: "Otonari Asobi Fanpage Việt nam",
    username: "OtonariAsobiVN",
    url: "https://facebook.com/OtonariAsobiVN",
    avatar: "/images/media/otonariasobi.webp",
  },
  {
    name: "Sứ Giả Bốn Mùa",
    username: "100094379739358",
    url: "https://facebook.com/profile.php?id=100094379739358",
    avatar: "/images/media/shunkashuutou.webp",
  },
];

const COMMENTS = [
  {
    content:
      'Giành ngôi nhất trong BXH LNVN vẫn sướng hơn giành giải thưởng Konorano <(")',
    author: "Hyddyt Ngok Ngek",
    username: "hyddytngokngek",
    avatar: "/images/media/hyddyt.webp",
  },
  {
    content:
      "Em nghĩ, fandom sẽ còn phát triển mạnh, nhất là khi Tsuki vừa nhá hàng spin-off của truyện. Đó là một dấu hiệu tích cực nhất về fandom này dù cho Vol 13 cũng đã ra mắt.",
    author: "Otome Game Sekai wa Mob ni Kibishii Sekai Desu Việt Nam",
    username: "MobSekaVietNam",
    avatar: "/images/media/mobuseka.webp",
  },
  {
    content:
      "Dù gì đi nữa, “chiếc cup trong lòng người hâm mộ luôn là chiếc cup quý giá nhất”. Nên hãy đón chờ điều gì thú vị sẽ xảy ra sắp tới tại BXH lần này.",
    author: "Otonari no Tenshi-sama Fanpage VN",
    username: "OtonariVNFP",
    avatar: "/images/media/tenshi.webp",
  },
  {
    content:
      "Chúng cháu sẽ vẫn chỉ giữ KPI như năm ngoái là lọt vô top 10. Còn về việc chúng cháu còn nắm giữ top 3 hay không thì chúng cháu sẽ để các fan quyết định ạ.",
    author: "Netoge no Yome ga Ninki Idol datta Vietnam Fanpage",
    username: "NetogeVN",
    avatar: "/images/media/netoge.webp",
  },
  {
    content:
      "Có lẽ chính nhờ sự kết hợp hài hoà giữa nhiều thể loại mà câu chuyện “Thám tử đã chết” mang một vẻ lôi cuốn riêng, không quá phức tạp như những bộ truyện thuần trinh thám hay thuần khoa học viễn tưởng, và cũng mang lại một sự giải trí nhẹ nhàng nhờ yếu tố tình cảm hài hước của nó.",
    author: "Tantei wa Mou, Shindeiru VN",
    username: "TanmoshiVN",
    avatar: "/images/media/tanmoshi.webp",
  },
];

export {
  ROUTES,
  SOCIAL,
  INTRODUCTION_INFO,
  AUTHORS,
  CATEGORIES,
  COMMENTS,
  TOP10,
  COLLAB_PAGES,
  TIMELINE,
};
