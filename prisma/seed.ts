import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Destination data from scraped sources
const destinationsData = [
  {
    id: "106",
    description: "Nằm trên cung đường du lịch lừng danh Nha Trang – Mũi Né – Đà Lạt, Ninh Thuận ẩn chứa sức quyến rũ, đặc sắc của người và cảnh. Ninh Thuận được bao bọc bởi ba mặt núi, một mặt biển, thiên nhiên phong phú từ Núi Chúa hoang sơ, vịnh Vĩnh Hy xanh êm, Tháp Chàm trầm mặc, đến những cánh đồng muối lấp lánh.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Vinh Vinh Hi 1 (2).jpg",
    name: "Ninh Thuận",
    code: "ninh-thuan",
  },
  {
    id: "108",
    description: "Nghệ An là một vùng địa linh nhân kiệt, thiên nhiên hùng vĩ, con người hào hoa và anh hùng. Đến  Nghệ An bạn được khám phá rừng nguyên sinh Pù Mát, Pù Huống, tắm biển Cửa Lò, Quỳnh Phương, Diễn Châu, Nghi Thiết và thăm di tích lịch sử văn hoá như đền Cuông, đền Cờn, đền Quả, đền Bạch Mã.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_DOI CHE THANH CHUONG (2).jpg",
    name: "Nghệ An",
    code: "nghe-an",
  },
  {
    id: "121",
    description: "Thiên nhiên Phú Yên đa dạng với núi sông, cao nguyên, hồ, đầm, vịnh, hải đảo, suối nước nóng. Cảnh đẹp tiêu biểu là Gành Đá Dĩa, Đầm Ô Loan  núi Đá Bia, vịnh Xuân Đài, bãi Môn, mũi Điện, vũng Rô, núi Nhạn sông Đà. Du lịch của Phú yên được đầu tư mạnh, với khách sạn 5*, nhiều khu nghỉ dưỡng.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_Nghinh Phong cape (2)-2.jpg",
    name: "Phú Yên",
    code: "phu-yen",
  },
  {
    id: "129",
    description: "Cao Bằng núi sông hùng vĩ, thiên nhiên hoang sơ, bao la với thác Bản Giốc đẹp nhất Việt Nam, động Ngườm Ngao thế giới của nhũ đá thiên nhiên. Cao Bằng cũng là vùng đất của truyền thống cách mạng với những di tích danh tiếng như hang Pác Bó, mộ anh Kim Đồng. ",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_CAO BANG OVER VIEW (7).jpg",
    name: "Cao Bằng",
    code: "cao-bang",
  },
  {
    id: "130",
    description: "Bắc Kạn là tỉnh nhiều tiềm năng du lịch với phong cảnh tự nhiên và nền văn hóa đậm đà bản sắc dân tộc miền núi Đông Bắc Việt Nam. Đến với Bắc Kạn, các bạn sẽ có dịp ghé thăm hồ Ba Bể với không gian yên bình, động Nàng Tiên - Na Rỳ, thác Nà Khoang hay bản Pác Ngòi nép mình bên triền núi. Bên cạnh đó, Bắc Kạn còn có các di tích lịch sử quan trọng.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_HO BA BE (1).jpg",
    name: "Bắc Kạn",
    code: "bac-kan",
  },
  {
    id: "133",
    description: "Thanh Hóa là tỉnh lớn thứ 5 Việt Nam, có lịch sử 6000 năm với những trang sử hào hùng nhất của dân tộc. Thiên nhiên phong phú, đẹp nhất là Sầm Sơn, Cẩm Lương, vườn Quốc gia Bến Én, động Từ Thức… Thanh Hóa nổi tiếng với hò sông Mã, ca trù, hát xoan, hát xường, khắp, lễ hội Pôồn Pôông cầu ngư, lễ hội đền Sòng.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Terraced rice field in water season in Pu Luong,.jpg",
    name: "Thanh Hóa",
    code: "thanh-hoa",
  },
  {
    id: "134",
    description: "Sơn La là tỉnh lớn thứ 3 Việt Nam, một phần Tây Bắc bên bờ sông Đà, sông Mã. Nằm trên cao nguyên Mộc Châu và Sơn La, đây chính là là mái nhà của Bắc Bộ. 12 dân tộc tạo nên bản sắc độc đáo của Sơn La, vùng đất nổi tiếng với rượu cần và mùa yêu say đắm tháng 3-4 khi hoa ban nở thắm núi rừng.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_Ethnic minority children playing on the green tea hill.jpg",
    name: "Sơn La",
    code: "son-la",
  },
  {
    id: "137",
    description: "Cà Mau quê hương của Bác Ba Phi, là thành phố trẻ 300 năm, là cực nam Việt Nam với 3 mặt tiếp giáp biển. Điểm hấp dẫn của Cà Mau là các đình quán cổ, khu di tích lịch sử và thiên nhiên ngập mặn độc đáo. Đặc sản nổi tiếng của Cà Mau phải kể đến mắm cá lóc, ba khía, tôm cua sò…",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_VQG MUI CA MAU (2).jpg",
    name: "Cà Mau",
    code: "ca-mau",
  },
  {
    id: "141",
    description: "Quy Nhơn có lịch sử dài 400 năm, chịu ảnh hưởng Chămpa thế kỷ 11, triều đại Tây Sơn và cảng Thị Nại thế kỷ 18. Thiên nhiên hoang sơ tĩnh lặng, núi đồi, đầm lầy nước mặn, đường bờ biển dài 42km với các bán đảo xinh đẹp. Quy Nhơn là đô thị loại I, đang phát triển thành trung tâm du lịch của miền Trung.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_Ky Co 1 (3).jpg",
    name: "Quy Nhơn",
    code: "qui-nhon",
  },
  {
    id: "187",
    description: "Điện Biên là tỉnh giàu tiềm năng du lịch, đặc biệt là lĩnh vực văn hoá - lịch sử.\r\nNổi bật nhất là hệ thống di tích lịch sử chiến thắng Điện Biên Phủ. Bên cạnh những địa danh lịch sử, Điện Biên còn hấp dẫn du khách bởi những địa danh có cảnh quan hùng vĩ và gần gũi với thiên nhiên như cánh đồng Mường Thanh, hồ Pá Khoang, Mường Phăng, Động Xá Nhè hay đèo Pha Lin hoang sơ, hùng vĩ.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_DIEN BIEN OVER VIEW (3).jpg",
    name: "Điện Biên",
    code: "dien-bien",
  },
  {
    id: "188",
    description: "Bến Tre như hòn đảo xanh giữa bốn bề sông nước Cửu Long và trở thành điểm du lịch hấp dẫn cho những ai thích khám phá không gian xanh mát. Hãy bắt đầu với Bến Tre, quê hương của những cây dừa.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240716_NONG TRAI HAI VAN - VAM HO (10).jpg",
    name: "Bến Tre",
    code: "ben-tre",
  },
  {
    id: "192",
    description: "Đến với Côn Đảo - vùng đất thiêng liêng của Tổ Quốc, Quý khách sẽ được tìm hiểu về lịch sử oai hùng qua các di tích, thăm muôn vàn cảnh đẹp hoang sơ, kỳ bí và thưởng trọn nét yên bình của vùng biển hiền hòa.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_DINH TINH YEU - BAI NHAT (1).jpg",
    name: "Côn Đảo",
    code: "con-dao",
  },
  {
    id: "193",
    description: "Kiên Giang được nhiều người biết đến là vùng đất văn hoá và du lịch nổi tiếng ở khu vực Đồng bằng sông Cửu Long. Đến Kiên Giang, du khách có vô vàn lựa chọn cho chuyến du hành của mình, nổi bật trong đó là những điểm đến hấp dẫn như thắng cảnh Hà Tiên, đảo Ngọc Phú Quốc, thành phố Rạch Giá hay rẽ sóng khám phá vẻ đẹp hoang sơ của quần đảo Nam Du xinh đẹp.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_211112_TOUR 4-5 DAO-2.jpg",
    name: "Kiên Giang",
    code: "kien-giang",
  },
  {
    id: "194",
    description: "Được biết đến từ sau sự kiện Nhật thực toàn phần vào năm 1995, Bình Thuận bắt đầu có sự đầu tư phát triển từ năm 2000. Sau 14 năm phát triển diện mạo du lịch Bình Thuận đã thay đổi hòan toàn, từ vùng biển hoang sơ Bình thuận nay đã trở thành khu nghỉ dưỡng, sinh thái biển hấp dẫn đông đảo du khách t",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Red sand dunes in Mui Ne.jpg",
    name: "Bình Thuận",
    code: "binh-thuan",
  },
  {
    id: "195",
    description: "Bất cứ du khách nào đến Hà Tĩnh sẽ bị thu hút bởi những bãi biển đẹp, núi non hùng vĩ cùng những món ăn ngon, đặc sản hấp dẫn nhưng vô cùng giản dị. Hà Tĩnh là mảnh đất nổi tiếng với nhiều bãi biển đẹp như Thiên Cầm, Ðèo Con, Xuân Thành, Chân Tiên và sông núi hùng vĩ thơ mộng. Vùng đất này còn lưu giữ một kho tàng di sản văn hóa phi vật thể độc đáo như ca trù, ví đò đưa, hát dặm.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_PU LUONG (2).jpg",
    name: "Hà Tĩnh",
    code: "ha-tinh",
  },
  {
    id: "196",
    description: "Nói đến vùng đất Quảng Ninh, không thể không nhắc đến Vịnh Hạ Long - nơi được UNESCO Công nhận hai lần là Di sản thiên nghiên thế giới với nhiều đảo, hòn và hang động đẹp nổi tiếng.\r\nBên cạnh đó Quảng Ninh còn có Bãi Cháy - là một bãi tắm rộng và đẹp nằm sát bờ vịnh Hạ Long; Núi Yên Tử - vốn là một thắng cảnh thiên nhiên - và cũng là nơi lưu giữ nhiều di tích lịch sử với mệnh danh \"đất tổ Phật giáo Việt Nam\"; và nhiều di tích, danh thắng nổi tiếng, hấp dẫn khác như đảo Tuần Châu, Cô Tô...",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_Indochine Premium r.jpg",
    name: "Quảng Ninh",
    code: "quang-ninh",
  },
  {
    id: "197",
    description: "Du lịch đến với thành phố Hồ Chí Minh  bạn có thể gặp những tòa nhà cao tầng nằm san sát, những khu vui chơi giải trí, trung tâm mua sắm sầm uất, nhưng cũng không thiếu những biệt thự cổ kính, những ngôi chợ truyền thống. Sài Gòn rộng lớn và không thiếu những \"đặc sản\" du lịch như du ngoạn ven sông Sài Gòn bằng tàu, thăm phố Tây Phạm Ngũ Lão, mua sắm ở chợ Bến Thành hay về với biển Cần Giờ.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_LANMARK 81 SKYVIEW (2) resize.jpg",
    name: "TP. Hồ Chí Minh",
    code: "ho-chi-minh",
  },
  {
    id: "198",
    description: "Quảng Ngãi nổi tiếng với nhiều danh lam thắng cảnh, đặc biệt là các bờ biển nổi tiếng như Mỹ Khê, Sa Huỳnh hay Vương quốc tỏi Lý Sơn là món quà quý giá mà thiên nhiên ban tặng. Ngoài ra, Quảng Ngãi còn nổi tiếng với những địa danh văn hóa lịch sử như  thành cổ Châu Sa, khu chứng tích Sơn Mỹ, quần thể di tích theo dòng nhật ký Đặng Thùy Trâm.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_200915_ly son (1).jpg",
    name: "Quảng Ngãi",
    code: "quang-ngai",
  },
  {
    id: "199",
    description: "\"Tháp Mười đẹp nhất bông sen\" câu ca như gợi nhớ về vẻ đẹp thuần khiết của vùng quê chân chất, mang nét hoang sơ nhưng đầy chất lãng mạn giữa bốn bề xanh mát bởi những cánh đồng lúa mơn man trong gió và những cánh cò trắng. Đồng Tháp còn là nơi nổi tiếng với ẩm thực khẩn hoang với những món ăn dân dã từ chuột đồng, cá lóc thui rơm, canh chua bông điên điểm vào mùa nước lũ.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_CANH DONG SEN DONG THAP (3).jpg",
    name: "Đồng Tháp",
    code: "dong-thap",
  },
  {
    id: "202",
    description: "Nhắc đến Vĩnh Phúc, người ta nhớ đến một Tam Đảo lãng đãng trong mây, hoang sơ mà hùng vĩ, và một hồ Đại Lải xanh ngát, bạt ngàn và trong trẻo. Ngoài ra, Vĩnh Phúc còn hấp dẫn khách du lịch bởi những điểm tham quan văn hóa lịch sử như Thiền viện Trúc Lâm Tây Thiên, làng gốm Hương Canh, lang hoa Mê Linh hay tháp Bình Sơn.\r\n",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_DINH TAY THIEN.jpg",
    name: "Vĩnh Phúc",
    code: "vinh-phuc",
  },
  {
    id: "203",
    description: "Là cửa ngỏ kết nối Thành phố Hồ Chí Minh với nước bạn Campuchia qua cửa khẩu Mộc Bài, Tây Ninh được xem là vùng đất lưu giữ nhiều giá trị văn hóa cổ có từ thời kỳ đồ đá với các hiện vật khảo cổ tại Gò Dinh Ông. Ngày nay, đến với Tây Ninh du khách nhớ mãi những danh thắng nổi tiếng như Tòa thánh Tây Ninh, hồ Dầu Tiếng mênh mông hay tham quan di tích Căn cứ Trung ương Cục Miền Nam, lên núi Bà Đen,... Du khách sẽ nhớ mãi món ngon xứ Trảng Bàng với Bánh tráng phơi sương.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240606_dc_240201_SUN WORLD BA DEN-CAP TREO VAN SON (19).jpg",
    name: "Tây Ninh",
    code: "tay-ninh",
  },
  {
    id: "206",
    description: "Bạc Liêu là vùng đất mới, gắn liền với lịch sử khẩn hoang của dân tộc về vùng đất phương Nam. Qua biết bao thăng trầm của lịch sử, vùng đất Bạc Liêu đã tích lũy cho mình những giá trị văn hóa riêng trong đó, Bạc Liêu nổi tiếng với di tích đồng Nọc Nạng, của dấu tích Văn hóa Óc Eo.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_CANH DONG DIEN GIO (7).jpg",
    name: "Bạc Liêu",
    code: "bac-lieu",
  },
  {
    id: "213",
    description: "Ngoài những miệt vườn sông nước sum xuê cây trái, cồn nổi ven biển,Trà Vinh còn nổi bật nhờ bản sắc văn hóa phong phú, kết hợp từ 3 dân tộc Kinh, Khơ Me và Hoa. Những điểm tham quan hấp dẫn tại Trà Vinh có:  Ao Bà Om, biển Ba Động và hàng ngàn ngôi chùa Khmer với kiển trúc độc đáo. Lễ hội Nghinh Ông, Lễ hội Chôl Chnăm Thmây, Lễ hội Ok Om Bok  sẽ mang lại cho bạn trải nghiệm văn hóa tuyệt vời.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_220325_CHUA ANG (2).jpg",
    name: "Trà Vinh",
    code: "tra-vinh",
  },
  {
    id: "214",
    description: "Vừa mang vẻ đẹp của vùng đồng bằng sông Cửu Long, vừa có nét duyên của miền Đông Nam bộ. Long An còn níu chân du khách bởi  lối kiến trúc độc đáo của Nhà trăm cột, cụm di tích Bình Tả hay hòa mình vào hương sen ngát ở Đồng Tháp Mười. Ngoài ra, ẩm thực  Long An cũng sẽ làm cho du khách mê mẩn không thôi với canh chua cá chốt, cá lóc nướng chui và rượu đế Gò Đen.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_211004_CANH DONG BAT TAN (3).jpg",
    name: "Long An",
    code: "long-an",
  },
  {
    id: "231",
    description: "Là một tỉnh miền núi Tây Bắc, với phong cảnh thiên nhiên đa dạng và nhiều đỉa điểm tham quan hấp dẫn như hang Thẩm Lé, hồ Thác Bà, du lịch sinh thái suối Giàng, cánh đồng Mường Lò và đặc biệt là ruộng bậc thang Mù Cang Chải… Tỉnh Yên Bái có nhiều dân tộc thiểu số và mỗi dân tộc mang đậm một bản sắc văn hoá riêng, là điểm đến tuyệt vời cho du khách.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_Hmong ethnic minority women walking on rice terraces-2 (1).jpg",
    name: "Yên Bái",
    code: "yen-bai",
  },
  {
    id: "232",
    description: "Nằm ở phía Nam dồng bằng Bắc Bộ được coi là kinh đô thứ hai của Nhà Trần với hàng loạt cung điện, thành quách in dấu một thời vàng son. Đến với nơi đây quý khách sẽ dược tham quan nhiều quần thể di tích với nhiều nét kiến trúc mang đậm bản sắc dân tộc như quần thể di tích văn hoá Trần, Phủ Dày, Chùa Cổ Lễ, Chùa Keo Hành Thiện, Nhà lưu niệm cố Tổng bí thư Trường Chinh... ",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_shutterstock_120928384.jpg",
    name: "Nam Định",
    code: "nam-dinh",
  },
  {
    id: "233",
    description: "Là một tỉnh miển ven biển ở đồng bằng sông Hồng, đến với Thái Bình quý khách sẻ được trải nghiệm không khí lễ hội tuyệt vời với gần 200 lễ hội đặc sắc Hội Xuân Chùa Keo, Hội Chùa Múa… cùng với đó là các địa điểm tham quan du lịch hấp dẫn như chùa Keo, di tích vua Trần, vườn Bách Thuận, nhà thờ chánh tòa Thái Bình và các bãi biển tuyệt đẹp như biển Đồng Châu, biển Cồn Thủ và Cồn Vành.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240926_Thái Bình.jpg",
    name: "Thái Bình",
    code: "thai-binh",
  },
  {
    id: "29",
    description: "Hà Nội là thủ đô ngàn năm văn hiến, còn lưu dấu nhiều di tích như Hồ Gươm, Cầu Thê Húc, Chùa Quán Sứ, Hồ Tây, 36 phố phường. Hà Nội có bốn mùa, luôn mang đến nhiều hoài niệm khó phai, mỗi mùa một vẻ, xuân lễ hội, hạ tươi thắm, thu quyến rũ và đông ấn tượng. Món ngon có Phở, Chả cá Lã Vọng, bánh tôm Hồ Tây.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_Guom Lake or Ho Guom, Ha Noi,.jpg",
    name: "Hà Nội",
    code: "ha-noi",
  },
  {
    id: "30",
    description: "Thành phố biển Hải Phòng, một trong những trung tâm du lịch lớn của Việt Nam. Hải Phòng còn giữ được nhiều di tích lịch sử, danh lam thắng cảnh và  đặc biệt là lễ hội chọi trâu ở Đồ Sơn. Hải Phòng nằm trong tuyến du lịch đặc sắc Hà Nội - Hải Phòng - vịnh Hạ Long. Từ  biển Đồ Sơn, du khách có thể tới thăm đảo và vườn quốc gia Cát Bà, thăm vịnh Bái Tử Long và vịnh Hạ Long.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_CAT BA (1).jpg",
    name: "Hải Phòng",
    code: "hai-phong",
  },
  {
    id: "32",
    description: "Hạ Long là thành phố tỉnh lỵ của tỉnh Quảng Ninh, được đặt theo tên của vịnh Hạ Long - vịnh biển nằm ở phía nam thành phố và là một di sản thiên nhiên nổi tiếng của Việt Nam.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_floating fishing village and rock island, Halong Bay,.jpg",
    name: "Hạ Long",
    code: "ha-long",
  },
  {
    id: "33",
    description: "Bắc Ninh là một trong những cái nôi của người Việt, có lịch sử hàng ngàn năm với di tích đô thị cổ Luy Lâu và nền thương mại phồn thịnh. Tới Bắc Ninh ta ngỡ ngàng với tinh hoa văn hoá trù phú, là quê hương của đền chùa miếu mạo, huyền thoại rực rỡ của triều đại Lý Trần.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_211207_shutterstock_1098396905.jpg",
    name: "Bắc Ninh",
    code: "bac-ninh",
  },
  {
    id: "34",
    description: "Phú Thọ thuộc vùng trung du miền núi phía Bắc, có bản sắc văn hoá từ thời Hùng Vương với 200 di tích lịch sử, danh lam thắng cảnh, di tích cách mạng kháng chiến. Đến Phú Thọ, bạn không thể bỏ lỡ các địa danh Ao Giời Suối Tiên, hang Lạng, Đền Hùng, đền Mẫu Âu Cơ.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_DOI CHE LONG COC.jpg",
    name: "Phú Thọ",
    code: "phu-tho",
  },
  {
    id: "341",
    description: null,
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_TA DUNG (2).jpg",
    name: "Đắk Nông",
    code: "dak-nong",
  },
  {
    id: "344",
    description: null,
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_SUP CAN GIO (10).jpg",
    name: "Cần Giờ",
    code: "can-gio",
  },
  {
    id: "35",
    description: "Với thiên nhiên hoang sơ, phong cảnh non nước hữu tình, Ninh Bình hiện đang là một trong những điểm đến nổi tiếng của miền Bắc. Đến với Ninh Bình, du khách sẽ có dịp tham quan những di sản thiên nhiên và di sản văn hóa thế giới Tràng An, chùa Bái Đính , Tam Cốc - Bích Động, khu bảo tồn thiên nhiên Vân Long  hay ghé thăm cố đô Hoa Lư, Nhà thờ Đá Phát Diệm.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_Trang An.jpg",
    name: "Ninh Bình",
    code: "ninh-binh",
  },
  {
    id: "361",
    description: "Là vùng chiêm trũng nằm ở cửa ngõ phía Nam của Hà Nội, Hà Nam được thiên nhiên ưu ái ban tặng cho rất nhiều danh lam thắng cảnh tuyệt đẹp. Ngoài ra ở đây cũng có nhiều di tích lịch sử, các làng nghề truyền thống lâu đời và các điểm du lịch tâm linh cực kỳ nổi tiếng.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_TAM CHUC (4).jpg",
    name: "Hà Nam",
    code: "ha-nam",
  },
  {
    id: "363",
    description: "Hoà Bình được xem là cái nôi của nền văn hoá Mường với vô vàn điều thú vị cực kỳ hấp dẫn du khách đến thăm quan các địa điểm du lịch Hòa Bình. Với vị trí địa lý thuận lợi, Hoà Bình luôn là địa điểm được nhiều người lựa chọn cho kỳ nghỉ ngắn ngày của gia đình và bạn bè",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Thac Bo Cave, Thung Nai Commune.jpg",
    name: "Hòa Bình",
    code: "hoa-binh",
  },
  {
    id: "367",
    description: "Bình Dương khoác lên mình một tấm áo hoàn toàn mới mẻ, với khí hậu ôn hòa, không khí mát mẻ cùng những vườn trái cây trĩu quả và những khu du lịch đầu tư quy mô sẽ là một địa điểm gần gũi nhưng không kém phần mới lạ cho những chuyến du lịch ngắn ngày vào cuối tuần.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_HO DAU TIENG.jpg",
    name: "Bình Dương",
    code: "binh-duong",
  },
  {
    id: "369",
    description: "Có lẽ với nhiều người, Bình Phước vẫn còn xa lạ và chưa được nhiều du khách biết đến. Đối với nhiều du khách Bình Phước chỉ có những cánh rừng cao su bạt ngàn, những vườn điều trĩu quả, vườn tiêu xanh tốt. Thế nhưng, chính vì \"sự chưa biết\" ấy mà Bình Phước vẫn còn những nét hoang sơ, tự nhiên thú vị và đây cũng chính là thế mạnh của du lịch Bình Phước. \r\n",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg__2504292_binhphuocvuonquocgiabugiamap.webp",
    name: "Bình Phước",
    code: "binh-phuoc",
  },
  {
    id: "37",
    description: "Lạng Sơn với \"Đồng Đăng có Phố Kì Lừa, có Nàng Tô Thị, có Chùa Tam Thanh\" cùng những danh thắng Mẫu Sơn, Thành Nhà Mạc, Ải Chi Lăng, Động Nhị Thanh, bến Đá Kì Cùng, hang động Chùa Tiên và Giếng Tiên, hang Gió. Đặc sản Lạng Sơn có phở chua, thịt quay, khấu nhục, rau bò khai, cải ngồng luộc.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_shutterstock_145660013.jpg",
    name: "Lạng Sơn",
    code: "lang-son",
  },
  {
    id: "371",
    description: "Nam Du",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_NAM DU  (5).jpg",
    name: "NAM DU",
    code: "Nam Du",
  },
  {
    id: "377",
    description: null,
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_hô lam binh.jpg",
    name: "Tuyên Quang",
    code: "Tuyen Quang",
  },
  {
    id: "38",
    description: "Lào Cai là khu du lịch trọng tâm của miền Bắc với những thắng cảnh Sa Pa thị trấn trong mây, chợ tình quyến rũ, đỉnh Phan Xi Păng và Cửa khẩu Quốc tế Lào Cai Hà Khẩu. Lào Cai có nhiều địa danh lịch sử, hang động tự nhiên, đặc sản và là nơi mang đậm nét đặc trưng văn hoá độc đáo của nhiều dân tộc.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_DINH FANSIPAN.jpg",
    name: "Lào Cai",
    code: "lao-cai",
  },
  {
    id: "393",
    description: null,
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_bien ho che.jpg",
    name: "Gia Lai",
    code: "gia-lai",
  },
  {
    id: "397",
    description: null,
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_Ga Da Lat (2).jpg",
    name: "Lâm Đồng",
    code: "lam-dong",
  },
  {
    id: "40",
    description: "Quảng Trị nổi tiếng với cụm Di tích Hiền Lương, Địa đạo Vịnh Mốc, Thành Cổ Quảng Trị. Bên cạnh đó Quảng Trị còn có nhiều danh lam thắng cảnh đẹp như Trằm Trà Lộc, suối nước nóng Klu, thác Ồ Ồ và nhiều bãi biển đẹp như Cửa Tùng, Cửa Việt, Vĩnh Thái, đảo Cồn Cỏ là nơi mang vẻ đẹp rất riêng với cát trắng tinh khôi, bằng phẳng, mịn màng, làn nước trong xanh mát lòng du khách.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_THANH CO QUANG TRI (1).jpg",
    name: "Quảng Trị",
    code: "quang-tri",
  },
  {
    id: "41",
    description: "Quảng Bình giao thoa nhiều luồng văn hoá, lưu giữ được nhiều di tích khác nhau, và được thiên nhiên ưu đãi với đường bờ biển dài 116,04km, những phong cảnh kỳ thú như Vườn quốc gia Phong Nha - Kẻ Bàng đã được UNESCO công nhận là di sản thiên nhiên thế giới.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_DONG THIEN DUONG (5).jpg",
    name: "Quảng Bình",
    code: "quang-binh",
  },
  {
    id: "410",
    description: null,
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_IMG_2349.jpg",
    name: "Phước Hải",
    code: "phuoc-hai",
  },
  {
    id: "412",
    description: "Du lịch Hội An hấp dẫn bởi khu phố cổ Hội An đẹp nên thơ. Hội An hiện nay đã được công nhận là đô thị loại III, trực thuộc tỉnh Quảng Nam. Hội An phía đông giáp biển Đông, phía tây giáp hai huyện Điện Bàn và Duy Xuyên, phía nam giáp huyện Duy Xuyên, phía bắc giáp huyện Điện Bàn, đều thuộc tỉnh Quảng Nam.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_Hoi An ancient town (6).jpg",
    name: "Hội An",
    code: "pho-co-hoi-an",
  },
  {
    id: "414",
    description: null,
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Nha Trang city beach.jpg",
    name: "Khánh Hòa",
    code: null,
  },
  {
    id: "42",
    description: "Đà Nẵng nằm giữa ba di sản thế giới: cố đô Huế, phố cổ Hội An và thánh địa Mỹ Sơn. Đà Nẵng còn có nhiều danh thắng tuyệt đẹp say lòng du khách như Ngũ Hành Sơn, Bà Nà, bán đảo Sơn Trà, đèo Hải Vân, sông Hàn thơ mộng và cầu quay Sông Hàn – niềm tự hào của thành phố, và biển Mỹ Khê đẹp nhất hành tinh.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_Cau Vang - Bana Hill (2).jpg",
    name: "Đà Nẵng",
    code: "da-nang",
  },
  {
    id: "43",
    description: "Quảng Nam còn được biết đến là vùng đất Địa Linh Nhân Kiệt, Ngũ Phụng Tề Phi, với di tích lịch sử lâu đời và nhiều lễ hội văn hóa đặc sắc. Những điểm đến thú vị tại Quảng Nam: Cù lao Chàm biển xanh sóng lặng, biển Cửa Đại nước trong vắt, Hội An hoài cổ, đền tháp Mỹ Sơn rực rỡ.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Hoi An Ve Dem (7).jpg",
    name: "Quảng Nam",
    code: "quang-nam",
  },
  {
    id: "44",
    description: "Biển Nha Trang tuyệt vời với Vinpearl Nha Trang 5* sang trọng, hòn Mun Hòn Tằm nước trong veo và san hô lộng lẫy, cùng với vịnh Ninh Vân, vịnh Vân Phong hoang sơ và thuần khiết. Viện Hải dương học Nha Trang có trên 20.000 mẫu sinh vật dưới nước, tháp Bà Ponagar hoàn mỹ của người Chăm.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_Vin Wonder (3).jpg",
    name: "Nha Trang",
    code: "nha-trang",
  },
  {
    id: "45",
    description: "Đà Lạt mộng mơ nơi mimosa và ngàn hoa khoe sắc, từ đồi Robin ngắm Hồ Tuyền Lâm, núi Voi, viếng Thiền Viện Trúc Lâm, thăm Dinh Bảo Đại, tản bộ dưới những tán thông, ngắm biệt thự cổ, nhấm nháp ly café ấm áp trong thời tiết se lạnh.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Ga Da Lat (2).jpg",
    name: "Đà Lạt",
    code: "da-lat",
  },
  {
    id: "47",
    description: "Buôn Ma Thuột luôn hấp dẫn,  mùa khô rừng cao su đổ lá, mùa mưa với tiếng gầm thét của dòng Serepok cuộn trào, tháng 3 \"mùa con ong đi lấy mật\" và là mùa lễ đua voi, mùa lúa chín rộn ràng. ",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Bao Tang Cafe (1).jpg",
    name: "Buôn Ma Thuột",
    code: "ban-me-thuot",
  },
  {
    id: "48",
    description: "Kon Tum thu hút người yêu du lịch bởi cảnh quan tự nhiên và văn hoá dân tộc lâu đời.  Đó là các di tích lịch sử đã được xếp hạng quốc gia, các công trình lịch sử, kiến trúc cổ, các khu bảo tồn thiên nhiên, khu du lịch sinh thái, không gian văn hóa cồng chiêng Tây Nguyên, di chỉ khảo cổ học Lung Leng.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Church in the city of Kon Tum (2).jpg",
    name: "Kon Tum",
    code: "kon-tum",
  },
  {
    id: "49",
    description: "Pleiku nằm bên Biển Hồ Tơ Nưng, một miệng núi lửa ngừng hoạt động trăm triệu năm, tài nguyên quý để xây dựng thuỷ điện Yaly. Đường Biển Hồ đẹp như mơ với rặng thông xanh ngắt, chùa Minh Thành hay chùa Thày Năm bình an, thanh tĩnh. ",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_hoa da quy pleiku.jpg",
    name: "Pleiku",
    code: "pleiku",
  },
  {
    id: "51",
    description: "Phan Thiết hấp dẫn với Lầu Ông Hoàng, tháp Chàm Pôshanư, bãi đá Ông Địa, rạn dừa Hàm Tiến. KDL Hòn Rơm cát trắng bên hàng dương xanh. Trượt cát trên Đồi Cát Bay, ngắm hoàng hôn trên đỉnh Đồi Hồng là nguồn cảm hứng bất tận của các nhiếp ảnh gia. ",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_Doi Cat (1)-2.jpg",
    name: "Phan Thiết",
    code: "phan-thiet",
  },
  {
    id: "52",
    description: "Đồng Nai là điểm đến picnic ngắn ngày lý tưởng với cụm đá Ba Chồng cao 36 mét kỳ thú, khu Bửu Long quanh hồ Long Ẩn, là một Vịnh Hạ Long thu nhỏ. Thác Giang Điền tung bọt trắng xóa, vườn quốc gia Cát Tiên UNESCO công nhận là khu dự trữ sinh quyển của thế giới và thác Mai đầy hoa lan rừng, hoa mai.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_VQG NAM CAT TIEN (5).jpg",
    name: "Đồng Nai",
    code: "dong-nai",
  },
  {
    id: "53",
    description: "Những cung đường biển đẹp như mơ, ngọn Hải đăng cổ nổi tiếng, tượng Chúa giang tay bình yên, những góc phố thơ mộng, cùng những món ăn hấp dẫn là những gì du khách không thể bỏ qua khi đến với Vũng Tàu. Vũng Tàu trở thành đô thị loại I năm 2013, là một thành phố đáng tới, đáng sống và hạnh phúc.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240726_BAI SAO.jpg",
    name: "Bà Rịa - Vũng Tàu",
    code: "vung-tau",
  },
  {
    id: "54",
    description: "Phú Quốc là điểm nghỉ dưỡng, lặn biển, tham quan, và khám phá sinh thái tuyệt vời. Mũi Ông Đội, Đá Chào là thế giới san hô và cá biển sặc sỡ. Bãi Sao cát trắng mịn, dáng cong, nước xanh ngọc bích. Đặc sản danh tiếng cả nước là tiêu sọ, nước mắm, rượu sim, ngọc trai. ",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_PHU QUOC (18).jpg",
    name: "Phú Quốc",
    code: "phu-quoc",
  },
  {
    id: "55",
    description: "Tiền Giang một phần không thể thiếu của ĐBSCL, nơi cầu Rạch Miễu bắc qua sông Mekong, cù lao Long - Lân - Quy - Phụng, cảng cá Mỹ Tho, làng nuôi cá bè cù lao Tân Phong, cồn Thới Sơn với vườn hoa kiểng, trái cây, vang tiếng đờn ca tài tử Nam Bộ. Đặc sản dừa tươi nổi tiếng ngọt ngay như lòng người Tiề",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240716_LAND CHO NOI CAI BE-CU LAO TAN PHONG (3).jpg",
    name: "Tiền Giang",
    code: "tien-giang",
  },
  {
    id: "56",
    description: "Về Cần Thơ thăm Bến Ninh Kiều, ngắm cầu Quang Trung, dạo chợ nổi Cái Răng nhộn nhịp, tham quan Nhà Cổ, thưởng thức đặc sản trái cây miền Tây trĩu ngọt. Khu du lịch sinh thái Mỹ Khánh là nơi bạn trải nghiệm các trò chơi dân gian vui nhộn như câu cá, chèo thuyền trên sông, đua heo. ",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240716_CHO NOI CAI RANG (4).jpg",
    name: "Cần Thơ",
    code: "can-tho",
  },
  {
    id: "57",
    description: "Vĩnh Long một phần không thể thiếu của ĐBSCL, nơi cầu Rạch Miễu bắc qua sông Mekong, cù lao Long - Lân - Quy - Phụng, cảng cá Mỹ Tho, làng nuôi cá bè cù lao Tân Phong, cồn Thới Sơn với vườn hoa kiểng, trái cây, vang tiếng đờn ca tài tử Nam Bộ. Đặc sản dừa tươi nổi tiếng ngọt ngay như lòng người Tiề",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_LO GACH MANG THIT.jpg",
    name: "Vĩnh Long",
    code: "vinh-long",
  },
  {
    id: "58",
    description: "Sóc Trăng cuốn hút với Chợ nổi Ngã Năm, vườn cò Tân Long thơ mộng, những ngôi chùa lớn Sà Lôn, Đất Sét, Kh'lieng và chùa Dơi với đặc trưng kiến trúc riêng biệt. Căn cứ Tỉnh ủy Sóc Trăng, một di tích cách mạng chống Pháp và bảo tàng Khmer Sóc Trăng lưu giữ tài liệu về một dân tộc Khmer đầy bản sắc.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_CHUA SOM RONG (3).jpg",
    name: "Sóc Trăng",
    code: "soc-trang",
  },
  {
    id: "59",
    description: "Hà Tiên đã đi vào văn chương với 10 cảnh đẹp danh tiếng xưa nay, nhờ tiềm năng du lịch phong phú gồm vũng, vịnh, đồng bằng, núi, sông, hang động, hải đảo. Vẫn còn đó những Bình San Diệp Thúy, lăng Mạc Cửu, Đông Hồ Ấn Nguyệt, Thạch Động Thôn Vân \"Động đá nuốt mây\", núi Tô Châu, núi Đá Dựng.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_220316_MUI NAI.jpg",
    name: "Hà Tiên",
    code: "ha-tien",
  },
  {
    id: "94",
    description: "Bình Định như kho báu thiên nhiên với bờ biển dài: Quy Nhơn, Tam Quan, Tân Thanh, Vĩnh Hội, Trung Lương, Hải Giang, Đảo Yến, bãi tắm đẹp như Hoàng Hậu, Quy Hòa, Bãi Dại, Tân Phụng, Vĩnh Lợi. Làng nghề vô cùng hấp dẫn như Rượu Bàu Đá, mộc mỹ nghệ, gốm, đặc sản Bún Song Thằn, Bánh tráng nước dừa.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240925_Eo Gio 3.jpg",
    name: "Bình Định",
    code: "binh-dinh",
  },
  {
    id: "99",
    description: "Tới An Giang ngắm kênh Vĩnh Tế thơ mộng, rừng tràm Trà Sư xanh ngát, tĩnh lặng. Lên núi Sập bạn ngắm mặt trời lặn trên 3 hồ nước, khám phá hệ thống hang động Tức Dụp bí ẩn, thăm nhà thờ cổ và lớn nhất nhất nước trên cù lao Giêng, đi lễ đền miếu Bà Chúa Xứ, Tây An Cổ Tự, viếng chùa Xà Tón phong cách Angkor.",
    imageSrc: "https://s3-cmc.travel.com.vn/vtv-image/Images/Destination/dg_240729_RUNG TRAM TRA SU (1).jpg",
    name: "An Giang",
    code: "an-giang",
  },
];

// Helper function to find image from destinations data by name
function findDestinationImage(destinations: typeof destinationsData, name: string): string | null {
  // Normalize name for comparison (remove accents, lowercase)
  const normalize = (str: string) => str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .trim();
  
  const normalizedSearch = normalize(name);
  
  // Try exact match first
  let found = destinations.find(d => 
    normalize(d.name) === normalizedSearch || 
    normalize(d.name).includes(normalizedSearch) ||
    normalizedSearch.includes(normalize(d.name))
  );
  
  // Try partial match for common variations
  if (!found) {
    // Common variations
    const variations: Record<string, string[]> = {
      "da lat": ["Đà Lạt", "Lâm Đồng"],
      "phu quoc": ["Phú Quốc", "Kiên Giang"],
      "sapa": ["Lào Cai", "Sapa"],
      "ha long": ["Hạ Long", "Quảng Ninh"],
      "hoi an": ["Hội An", "Quảng Nam"],
      "da nang": ["Đà Nẵng"],
      "nha trang": ["Nha Trang", "Khánh Hòa"],
      "hue": ["Huế", "Thừa Thiên Huế"],
      "can tho": ["Cần Thơ"],
      "my tho": ["Tiền Giang", "Mỹ Tho"],
    };
    
    for (const [key, values] of Object.entries(variations)) {
      if (normalizedSearch.includes(key)) {
        for (const value of values) {
          found = destinations.find(d => 
            normalize(d.name).includes(normalize(value)) || 
            normalize(value).includes(normalize(d.name))
          );
          if (found) break;
        }
        if (found) break;
      }
    }
  }
  
  return found?.imageSrc || null;
}

// Helper function to generate tour data from destination
function generateTourFromDestination(dest: typeof destinationsData[0], allDestinations: typeof destinationsData) {
  // Skip if no description
  if (!dest.description) return null;

  // Determine tour duration based on destination type
  const isMountain = dest.description.toLowerCase().includes('núi') || 
                     dest.description.toLowerCase().includes('cao nguyên') ||
                     dest.description.toLowerCase().includes('sapa') ||
                     dest.description.toLowerCase().includes('điện biên');
  const isCoastal = dest.description.toLowerCase().includes('biển') || 
                    dest.description.toLowerCase().includes('bãi') ||
                    dest.description.toLowerCase().includes('đảo') ||
                    dest.description.toLowerCase().includes('vịnh');
  
  // Default values
  let so_ngay = 2;
  let so_dem = 1;
  let gia_nguoi_lon = 2000000;
  let phuong_tien = "Xe du lịch";
  let khach_san = "Khách sạn 3 sao";
  
  // Adjust based on destination characteristics
  if (isMountain) {
    so_ngay = 3;
    so_dem = 2;
    gia_nguoi_lon = 2500000;
  } else if (isCoastal) {
    so_ngay = 3;
    so_dem = 2;
    gia_nguoi_lon = 3000000;
    phuong_tien = "Xe du lịch + Máy bay";
    khach_san = "Resort 3-4 sao";
  } else {
    so_ngay = 2;
    so_dem = 1;
    gia_nguoi_lon = 1800000;
  }

  // Extract short description (first 100 characters)
  const mo_ta_ngan = dest.description.length > 100 
    ? dest.description.substring(0, 100) + "..." 
    : dest.description;

  // Determine departure point based on destination location
  // Northern destinations: start from Hanoi
  const northernDestinations = [
    "Hà Nội", "Hải Phòng", "Quảng Ninh", "Hạ Long", "Cao Bằng", 
    "Bắc Kạn", "Lạng Sơn", "Lào Cai", "Sơn La", "Yên Bái",
    "Tuyên Quang", "Phú Thọ", "Vĩnh Phúc", "Bắc Ninh", "Hà Nam",
    "Hòa Bình", "Ninh Bình", "Thái Bình", "Nam Định", "Điện Biên"
  ];
  
  // Central destinations: can start from either city
  const centralDestinations = [
    "Nghệ An", "Thanh Hóa", "Hà Tĩnh", "Quảng Bình", "Quảng Trị",
    "Quảng Nam", "Quảng Ngãi", "Đà Nẵng", "Hội An", "Bình Định",
    "Phú Yên", "Quy Nhơn", "Ninh Thuận", "Khánh Hòa", "Nha Trang"
  ];

  let diem_khoi_hanh = "TP. Hồ Chí Minh"; // Default for Southern destinations
  if (northernDestinations.some(name => dest.name.includes(name))) {
    diem_khoi_hanh = "Hà Nội";
  } else if (centralDestinations.some(name => dest.name.includes(name))) {
    // Central destinations can start from either, randomly pick one for variety
    diem_khoi_hanh = Math.random() > 0.5 ? "Hà Nội" : "TP. Hồ Chí Minh";
  }

  return {
    ten_tour: `Tour ${dest.name} ${so_ngay}N${so_dem}Đ - Khám phá ${dest.name}`,
    mo_ta_ngan,
    mo_ta: dest.description,
    gia_nguoi_lon,
    gia_tre_em: Math.round(gia_nguoi_lon * 0.6),
    so_ngay,
    so_dem,
    diem_khoi_hanh,
    diem_den: dest.name,
    phuong_tien,
    khach_san,
    so_cho_toi_da: 30,
    so_cho_trong: 30,
    trang_thai: "dang_ban" as const,
    bao_gom: [
      "Xe du lịch đời mới, máy lạnh",
      `${khach_san}, phòng đôi/twin`,
      "Ăn sáng tại khách sạn",
      "Hướng dẫn viên chuyên nghiệp",
      "Bảo hiểm du lịch",
      "Vé tham quan các điểm du lịch",
    ],
    khong_bao_gom: [
      isCoastal ? "Vé máy bay" : "",
      "Ăn trưa, tối",
      "Chi phí cá nhân",
      "Thuế VAT",
      "Đồ uống",
    ].filter(Boolean),
    dieu_kien: "Hủy trước 7 ngày: hoàn 100%\nHủy trước 3 ngày: hoàn 50%\nHủy dưới 3 ngày: không hoàn",
    hinh_anh_chinh: dest.imageSrc,
    images: (() => {
      // Tạo array với hình chính từ destination hiện tại
      const imageArray = [
        { url: dest.imageSrc, alt_text: `${dest.name} - Hình ảnh chính` },
      ];
      
      // Lọc các destinations khác có hình ảnh hợp lệ (không phải destination hiện tại)
      const otherDestinations = allDestinations.filter(
        d => d.id !== dest.id && d.imageSrc && d.imageSrc.startsWith('http')
      );
      
      if (otherDestinations.length > 0) {
        // Tính toán index dựa trên name để đảm bảo nhất quán
        const hash = dest.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const startIndex = hash % otherDestinations.length;
        
        // Lấy 3 hình từ các destinations khác
        const numImages = Math.min(3, otherDestinations.length);
        for (let i = 0; i < numImages; i++) {
          const destIndex = (startIndex + i) % otherDestinations.length;
          const selectedDest = otherDestinations[destIndex];
          imageArray.push({
            url: selectedDest.imageSrc,
            alt_text: `${dest.name} - ${selectedDest.name}`,
          });
        }
      }
      
      return imageArray;
    })(),
  };
}

async function main() {
  console.log('🌱 Starting TravelBook database seeding...');

  // Clear existing data (optional - be careful in production)
  // await prisma.booking.deleteMany();
  // await prisma.tourImage.deleteMany();
  // await prisma.tour.deleteMany();
  // await prisma.thongBao.deleteMany();
  // await prisma.token.deleteMany();
  // await prisma.nguoiDung.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.nguoiDung.upsert({
    where: { email: "admin@travelbook.com" },
    update: {},
    create: {
      email: "admin@travelbook.com",
      mat_khau: hashedPassword,
      ho_ten: "Admin TravelBook",
      so_dien_thoai: "0123456789",
      vai_tro: "admin",
      dia_chi: "Hà Nội, Việt Nam",
    },
  });

  console.log(`👤 Created admin user: ${admin.email}`);

  // Create sample customer users
  const customers = [];
  const customerData = [
    {
      email: "khach1@example.com",
      ho_ten: "Nguyễn Văn A",
      so_dien_thoai: "0912345678",
    },
    {
      email: "khach2@example.com",
      ho_ten: "Trần Thị B",
      so_dien_thoai: "0923456789",
    },
    {
      email: "khach3@example.com",
      ho_ten: "Lê Văn C",
      so_dien_thoai: "0934567890",
    },
  ];

  for (const data of customerData) {
    const customer = await prisma.nguoiDung.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        mat_khau: await bcrypt.hash("123456", 10),
        vai_tro: "khach_hang",
        dia_chi: "TP. Hồ Chí Minh, Việt Nam",
      },
    });
    customers.push(customer);
  }

  console.log(`👥 Created ${customers.length} customer users`);

  // Create sample tours
  const tours = [];
  const tourData = [
    {
      ten_tour: "Tour Đà Lạt 3N2Đ - Khám phá Thành phố Ngàn Hoa",
      mo_ta_ngan: "Khám phá thành phố mộng mơ với không khí trong lành, cảnh đẹp thiên nhiên và văn hóa đặc sắc",
      mo_ta: "Đà Lạt - thành phố ngàn hoa, nơi có khí hậu mát mẻ quanh năm. Tour sẽ đưa bạn đến các điểm tham quan nổi tiếng như Hồ Xuân Hương, Thung lũng Tình Yêu, Chùa Linh Phước, và nhiều địa điểm khác.",
      gia_nguoi_lon: 2500000,
      gia_tre_em: 1500000,
      so_ngay: 3,
      so_dem: 2,
      diem_khoi_hanh: "TP. Hồ Chí Minh",
      diem_den: "Đà Lạt",
      phuong_tien: "Xe du lịch",
      khach_san: "Khách sạn 3 sao",
      so_cho_toi_da: 30,
      so_cho_trong: 30,
      trang_thai: "dang_ban",
      bao_gom: [
        "Xe du lịch đời mới, máy lạnh",
        "Khách sạn 3 sao, phòng đôi/twin",
        "Ăn sáng tại khách sạn",
        "Hướng dẫn viên chuyên nghiệp",
        "Bảo hiểm du lịch",
      ],
      khong_bao_gom: [
        "Vé máy bay",
        "Ăn trưa, tối",
        "Chi phí cá nhân",
        "Thuế VAT",
      ],
      dieu_kien: "Hủy trước 7 ngày: hoàn 100%\nHủy trước 3 ngày: hoàn 50%\nHủy dưới 3 ngày: không hoàn",
      hinh_anh_chinh: "/images/cards/card-01.jpg",
      images: [
        { url: "/images/cards/card-01.jpg", alt_text: "Đà Lạt" },
        { url: "/images/cards/card-02.jpg", alt_text: "Hồ Xuân Hương" },
      ],
    },
    {
      ten_tour: "Tour Phú Quốc 4N3Đ - Thiên đường biển đảo",
      mo_ta_ngan: "Trải nghiệm thiên đường biển đảo với bãi biển đẹp, resort sang trọng và ẩm thực hải sản tươi ngon",
      mo_ta: "Phú Quốc - hòn đảo ngọc của Việt Nam với những bãi biển tuyệt đẹp, nước biển trong xanh. Tour bao gồm tham quan các bãi biển, làng chài, vườn tiêu và thưởng thức hải sản tươi sống.",
      gia_nguoi_lon: 3500000,
      gia_tre_em: 2000000,
      so_ngay: 4,
      so_dem: 3,
      diem_khoi_hanh: "TP. Hồ Chí Minh",
      diem_den: "Phú Quốc",
      phuong_tien: "Máy bay + Xe du lịch",
      khach_san: "Resort 4 sao",
      so_cho_toi_da: 25,
      so_cho_trong: 25,
      trang_thai: "dang_ban",
      bao_gom: [
        "Vé máy bay khứ hồi",
        "Resort 4 sao, phòng view biển",
        "Ăn sáng buffet",
        "Xe đưa đón sân bay",
        "Hướng dẫn viên",
        "Bảo hiểm du lịch",
      ],
      khong_bao_gom: [
        "Ăn trưa, tối",
        "Chi phí cá nhân",
        "Thuế VAT",
        "Dịch vụ spa",
      ],
      dieu_kien: "Hủy trước 14 ngày: hoàn 100%\nHủy trước 7 ngày: hoàn 70%\nHủy dưới 7 ngày: không hoàn",
      hinh_anh_chinh: "/images/cards/card-02.jpg",
      images: [
        { url: "/images/cards/card-02.jpg", alt_text: "Phú Quốc" },
        { url: "/images/cards/card-03.jpg", alt_text: "Bãi biển Phú Quốc" },
      ],
    },
    {
      ten_tour: "Tour Hà Nội - Sapa 5N4Đ - Khám phá vùng núi Tây Bắc",
      mo_ta_ngan: "Khám phá thủ đô Hà Nội và vùng núi Sapa với cảnh quan hùng vĩ, văn hóa dân tộc đa dạng",
      mo_ta: "Hành trình đưa bạn từ thủ đô Hà Nội đến Sapa - thị trấn mù sương nổi tiếng. Tham quan các điểm như Fansipan, bản Cát Cát, thung lũng Mường Hoa và trải nghiệm văn hóa các dân tộc vùng cao.",
      gia_nguoi_lon: 4200000,
      gia_tre_em: 2500000,
      so_ngay: 5,
      so_dem: 4,
      diem_khoi_hanh: "TP. Hồ Chí Minh",
      diem_den: "Hà Nội - Sapa",
      phuong_tien: "Máy bay + Xe du lịch",
      khach_san: "Khách sạn 3-4 sao",
      so_cho_toi_da: 20,
      so_cho_trong: 20,
      trang_thai: "dang_ban",
      bao_gom: [
        "Vé máy bay khứ hồi",
        "Khách sạn 3-4 sao",
        "Ăn sáng",
        "Xe du lịch đời mới",
        "Hướng dẫn viên",
        "Vé cáp treo Fansipan",
        "Bảo hiểm du lịch",
      ],
      khong_bao_gom: [
        "Ăn trưa, tối",
        "Chi phí cá nhân",
        "Thuế VAT",
      ],
      dieu_kien: "Hủy trước 10 ngày: hoàn 100%\nHủy trước 5 ngày: hoàn 50%\nHủy dưới 5 ngày: không hoàn",
      hinh_anh_chinh: "/images/cards/card-03.jpg",
      images: [
        { url: "/images/cards/card-03.jpg", alt_text: "Sapa" },
        { url: "/images/cards/card-01.jpg", alt_text: "Fansipan" },
      ],
    },
  ];

  for (const data of tourData) {
    const { images, ...tourInfo } = data;
    const tour = await prisma.tour.create({
      data: {
        ...tourInfo,
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            alt_text: img.alt_text,
            thu_tu: index,
          })),
        },
      },
    });
    tours.push(tour);
  }

  console.log(`✈️ Created ${tours.length} sample tours`);

  // Create tours from destinations data
  let destinationTourCount = 0;
  for (const destination of destinationsData) {
    const tourData = generateTourFromDestination(destination, destinationsData);
    if (tourData) {
      const { images, ...tourInfo } = tourData;
      const tour = await prisma.tour.create({
        data: {
          ...tourInfo,
          images: {
            create: images.map((img, index) => ({
              url: img.url,
              alt_text: img.alt_text,
              thu_tu: index,
            })),
          },
        },
      });
      tours.push(tour);
      destinationTourCount++;
    }
  }

  console.log(`✈️ Created ${destinationTourCount} tours from destinations data`);
  console.log(`✈️ Total: ${tours.length} tours created`);

  // Create sample bookings
  const bookings = [];
  const bookingData = [
    {
      tour_id: tours[0].id,
      nguoi_dung_id: customers[0].id,
      ho_ten: "Nguyễn Văn A",
      email: "khach1@example.com",
      so_dien_thoai: "0912345678",
      dia_chi: "123 Đường ABC, Quận 1, TP.HCM",
      so_nguoi_lon: 2,
      so_tre_em: 1,
      ngay_khoi_hanh: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      tong_tien: 2 * tours[0].gia_nguoi_lon + 1 * (tours[0].gia_tre_em || 0),
      trang_thai: "cho_xac_nhan",
      ghi_chu: "Cần phòng view đẹp",
    },
    {
      tour_id: tours[1].id,
      nguoi_dung_id: null, // Guest booking
      ho_ten: "Trần Thị D",
      email: "guest@example.com",
      so_dien_thoai: "0945678901",
      dia_chi: "456 Đường XYZ, Quận 2, TP.HCM",
      so_nguoi_lon: 1,
      so_tre_em: 0,
      ngay_khoi_hanh: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      tong_tien: tours[1].gia_nguoi_lon,
      trang_thai: "da_xac_nhan",
      ghi_chu: "",
    },
  ];

  for (const data of bookingData) {
    const booking = await prisma.booking.create({
      data,
    });
    bookings.push(booking);

    // Update available slots if booking is confirmed
    if (data.trang_thai === "da_xac_nhan") {
      const tour = await prisma.tour.findUnique({
        where: { id: data.tour_id },
      });
      if (tour) {
        await prisma.tour.update({
          where: { id: data.tour_id },
          data: {
            so_cho_trong: tour.so_cho_trong - (data.so_nguoi_lon + data.so_tre_em),
          },
        });
      }
    }
  }

  console.log(`📋 Created ${bookings.length} bookings`);

  // Create sample notifications
  const notifications = [];
  for (const booking of bookings) {
    if (booking.nguoi_dung_id) {
      const notification = await prisma.thongBao.create({
        data: {
          nguoi_dung_id: booking.nguoi_dung_id,
          booking_id: booking.id,
          tieu_de: "Đặt tour thành công",
          noi_dung: `Bạn đã đặt tour thành công. Mã đặt tour: #${booking.id}`,
          loai: "dat_tour",
          da_doc: false,
        },
      });
      notifications.push(notification);
    }
  }

  console.log(`🔔 Created ${notifications.length} notifications`);

  // Create sample blogs
  const blogs = [];
  const blogData = [
    {
      tieu_de: "10 Điểm Đến Du Lịch Đẹp Nhất Việt Nam 2025",
      slug: "10-diem-den-du-lich-dep-nhat-viet-nam-2025",
      mo_ta_ngan: "Khám phá những địa điểm du lịch tuyệt vời nhất tại Việt Nam, từ phố cổ Hội An đến vịnh Hạ Long hùng vĩ...",
      noi_dung: "Việt Nam là một đất nước với vô vàn cảnh đẹp thiên nhiên và văn hóa đặc sắc. Từ Bắc vào Nam, mỗi vùng miền đều có những điểm đến hấp dẫn riêng.\n\n1. Vịnh Hạ Long - Kỳ quan thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ\n2. Phố cổ Hội An - Di sản văn hóa thế giới với kiến trúc cổ kính\n3. Đà Lạt - Thành phố ngàn hoa với khí hậu mát mẻ quanh năm\n4. Phú Quốc - Thiên đường biển đảo với những bãi biển tuyệt đẹp\n5. Sapa - Vùng núi Tây Bắc với ruộng bậc thang hùng vĩ\n6. Huế - Cố đô với di tích lịch sử và văn hóa\n7. Mỹ Tho - Châu thổ sông Cửu Long với vườn trái cây\n8. Nha Trang - Thành phố biển với resort sang trọng\n9. Đà Nẵng - Thành phố đáng sống với nhiều điểm tham quan\n10. Cần Thơ - Trung tâm đồng bằng sông Cửu Long",
      hinh_anh: findDestinationImage(destinationsData, "Hạ Long") || findDestinationImage(destinationsData, "Quảng Ninh") || "/images/cards/card-01.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Việt Nam", "Du lịch", "Điểm đến", "2025"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-15"),
    },
    {
      tieu_de: "Bí Quyết Đặt Tour Du Lịch Tiết Kiệm",
      slug: "bi-quyet-dat-tour-du-lich-tiet-kiem",
      mo_ta_ngan: "Những mẹo hay giúp bạn đặt tour du lịch với giá tốt nhất, tận dụng các chương trình khuyến mãi...",
      noi_dung: "Đặt tour du lịch với giá tốt không phải là điều khó khăn nếu bạn biết những bí quyết sau:\n\n1. Đặt tour sớm - Nhiều công ty du lịch có chương trình giảm giá cho khách đặt sớm\n2. Theo dõi các chương trình khuyến mãi - Đăng ký nhận thông báo từ các website du lịch\n3. Đặt tour vào mùa thấp điểm - Giá tour thường rẻ hơn vào mùa thấp điểm\n4. So sánh giá từ nhiều nguồn - Không nên chỉ xem một nguồn\n5. Tận dụng các chương trình tích điểm - Nhiều thẻ tín dụng có chương trình tích điểm\n6. Đặt tour theo nhóm - Giá tour theo nhóm thường rẻ hơn\n7. Lựa chọn tour phù hợp với ngân sách - Không cần phải chọn tour đắt nhất",
      hinh_anh: "/images/cards/card-02.jpg",
      danh_muc: "Tips du lịch",
      tags: ["Tiết kiệm", "Mẹo", "Tour", "Du lịch"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-12"),
    },
    {
      tieu_de: "Hành Trình Khám Phá Đà Lạt - Thành Phố Ngàn Hoa",
      slug: "hanh-trinh-kham-pha-da-lat-thanh-pho-ngan-hoa",
      mo_ta_ngan: "Trải nghiệm Đà Lạt với khí hậu mát mẻ, cảnh đẹp thiên nhiên và văn hóa đặc sắc của vùng cao nguyên...",
      noi_dung: "Đà Lạt - thành phố ngàn hoa, nơi có khí hậu mát mẻ quanh năm. Thành phố này nằm ở độ cao 1.500m so với mực nước biển, tạo nên một khí hậu ôn đới độc đáo.\n\nCác điểm tham quan nổi tiếng:\n- Hồ Xuân Hương: Hồ nước đẹp ở trung tâm thành phố\n- Thung lũng Tình Yêu: Địa điểm lãng mạn với hoa và cảnh đẹp\n- Chùa Linh Phước: Ngôi chùa với kiến trúc độc đáo\n- Đồi Cù: Đồi cỏ xanh với view toàn thành phố\n- Vườn hoa thành phố: Nơi trưng bày nhiều loài hoa đẹp\n\nẨm thực Đà Lạt:\n- Bánh mì xíu mại\n- Bánh căn\n- Bánh tráng nướng\n- Dâu tây tươi\n- Rượu vang Đà Lạt",
      hinh_anh: findDestinationImage(destinationsData, "Đà Lạt") || findDestinationImage(destinationsData, "Lâm Đồng") || "/images/cards/card-03.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Đà Lạt", "Du lịch", "Cao nguyên", "Việt Nam"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-10"),
    },
    {
      tieu_de: "Checklist Chuẩn Bị Cho Chuyến Du Lịch Dài Ngày",
      slug: "checklist-chuan-bi-cho-chuyen-du-lich-dai-ngay",
      mo_ta_ngan: "Danh sách đầy đủ những vật dụng cần thiết cho chuyến du lịch dài ngày, đảm bảo bạn không quên gì...",
      noi_dung: "Chuẩn bị kỹ lưỡng là chìa khóa cho một chuyến du lịch thành công. Dưới đây là checklist đầy đủ:\n\nGiấy tờ:\n- Hộ chiếu/Visa (nếu đi nước ngoài)\n- Vé máy bay/tàu/xe\n- Bảo hiểm du lịch\n- Bản sao giấy tờ quan trọng\n\nQuần áo:\n- Quần áo phù hợp với thời tiết\n- Áo khoác/áo mưa\n- Giày dép thoải mái\n- Đồ lót đủ dùng\n\nĐồ dùng cá nhân:\n- Bàn chải đánh răng, kem đánh răng\n- Dầu gội, sữa tắm\n- Khăn tắm\n- Thuốc men cá nhân\n\nĐồ điện tử:\n- Điện thoại và sạc\n- Máy ảnh\n- Power bank\n- Adapter (nếu đi nước ngoài)\n\nKhác:\n- Tiền mặt và thẻ tín dụng\n- Bản đồ/GPS\n- Sách/trò chơi giải trí",
      hinh_anh: "/images/cards/card-01.jpg",
      danh_muc: "Tips du lịch",
      tags: ["Checklist", "Chuẩn bị", "Du lịch", "Mẹo"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-08"),
    },
    {
      tieu_de: "Phú Quốc - Thiên Đường Biển Đảo Của Việt Nam",
      slug: "phu-quoc-thien-duong-bien-dao-cua-viet-nam",
      mo_ta_ngan: "Khám phá hòn đảo ngọc Phú Quốc với những bãi biển tuyệt đẹp, resort sang trọng và ẩm thực hải sản tươi ngon...",
      noi_dung: "Phú Quốc - hòn đảo ngọc của Việt Nam, nằm ở vịnh Thái Lan. Đảo này nổi tiếng với những bãi biển tuyệt đẹp, nước biển trong xanh và cát trắng mịn.\n\nCác bãi biển nổi tiếng:\n- Bãi Sao: Bãi biển đẹp nhất với cát trắng mịn\n- Bãi Dài: Bãi biển dài với nhiều resort\n- Bãi Khem: Bãi biển yên tĩnh, lý tưởng để nghỉ dưỡng\n- Bãi Trường: Bãi biển dài với nhiều hoạt động\n\nĐiểm tham quan:\n- Vườn Quốc gia Phú Quốc\n- Làng chài Hàm Ninh\n- Vườn tiêu\n- Nhà tù Phú Quốc\n- Chợ đêm Phú Quốc\n\nẨm thực:\n- Hải sản tươi sống\n- Nước mắm Phú Quốc\n- Sim rừng\n- Rượu sim",
      hinh_anh: findDestinationImage(destinationsData, "Phú Quốc") || findDestinationImage(destinationsData, "Kiên Giang") || "/images/cards/card-02.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Phú Quốc", "Biển đảo", "Du lịch", "Việt Nam"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-05"),
    },
    {
      tieu_de: "Những Lưu Ý Khi Đặt Tour Du Lịch Quốc Tế",
      slug: "nhung-luu-y-khi-dat-tour-du-lich-quoc-te",
      mo_ta_ngan: "Các điều cần biết khi đặt tour du lịch nước ngoài: visa, bảo hiểm, tiền tệ và các thủ tục cần thiết...",
      noi_dung: "Du lịch quốc tế đòi hỏi sự chuẩn bị kỹ lưỡng hơn so với du lịch trong nước. Dưới đây là những lưu ý quan trọng:\n\nVisa:\n- Kiểm tra yêu cầu visa của quốc gia bạn muốn đến\n- Chuẩn bị hồ sơ xin visa sớm\n- Đảm bảo hộ chiếu còn hạn ít nhất 6 tháng\n\nBảo hiểm:\n- Mua bảo hiểm du lịch quốc tế\n- Kiểm tra phạm vi bảo hiểm\n- Lưu số điện thoại khẩn cấp\n\nTiền tệ:\n- Đổi tiền trước khi đi\n- Mang thẻ tín dụng quốc tế\n- Kiểm tra tỷ giá hối đoái\n\nSức khỏe:\n- Tiêm phòng nếu cần\n- Mang thuốc men cá nhân\n- Kiểm tra yêu cầu y tế của quốc gia\n\nKhác:\n- Nghiên cứu văn hóa địa phương\n- Học một vài câu giao tiếp cơ bản\n- Lưu thông tin đại sứ quán",
      hinh_anh: "/images/cards/card-03.jpg",
      danh_muc: "Du lịch quốc tế",
      tags: ["Du lịch quốc tế", "Visa", "Bảo hiểm", "Mẹo"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-03"),
    },
    {
      tieu_de: "Sapa - Nơi Gặp Gỡ Giữa Trời Và Đất",
      slug: "sapa-noi-gap-go-giua-troi-va-dat",
      mo_ta_ngan: "Khám phá Sapa với những ruộng bậc thang tuyệt đẹp, văn hóa dân tộc đa dạng và khí hậu mát mẻ quanh năm...",
      noi_dung: "Sapa - thị trấn mù sương nằm ở độ cao 1.600m, là điểm đến lý tưởng cho những ai yêu thích thiên nhiên và văn hóa.\n\nCảnh quan:\n- Ruộng bậc thang: Những thửa ruộng bậc thang tuyệt đẹp\n- Núi Fansipan: Nóc nhà Đông Dương\n- Thung lũng Mường Hoa: Thung lũng với nhiều bản làng\n- Cầu Mây: Cây cầu treo độc đáo\n\nVăn hóa:\n- Bản Cát Cát: Bản làng của người H'Mông\n- Bản Tả Phìn: Bản làng của người Dao\n- Chợ tình Sapa: Chợ đặc biệt vào cuối tuần\n- Văn hóa các dân tộc: H'Mông, Dao, Tày, Giáy\n\nHoạt động:\n- Trekking\n- Leo núi Fansipan\n- Tham quan bản làng\n- Mua sắm đồ thủ công",
      hinh_anh: findDestinationImage(destinationsData, "Lào Cai") || findDestinationImage(destinationsData, "Sapa") || "/images/cards/card-01.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Sapa", "Du lịch", "Văn hóa", "Việt Nam"],
      trang_thai: "published",
      ngay_dang: new Date("2025-11-01"),
    },
    {
      tieu_de: "Cách Chọn Tour Du Lịch Phù Hợp Với Ngân Sách",
      slug: "cach-chon-tour-du-lich-phu-hop-voi-ngan-sach",
      mo_ta_ngan: "Hướng dẫn chi tiết cách lựa chọn tour du lịch phù hợp với ngân sách của bạn mà vẫn đảm bảo chất lượng...",
      noi_dung: "Chọn tour du lịch phù hợp với ngân sách không có nghĩa là phải hy sinh chất lượng. Dưới đây là cách chọn tour thông minh:\n\n1. Xác định ngân sách:\n- Quyết định số tiền bạn sẵn sàng chi cho chuyến đi\n- Bao gồm cả chi phí phát sinh\n\n2. So sánh các tour:\n- So sánh giá từ nhiều công ty\n- Kiểm tra những gì được bao gồm\n- Đọc kỹ điều khoản\n\n3. Lựa chọn thời điểm:\n- Mùa thấp điểm thường rẻ hơn\n- Tránh các ngày lễ tết\n\n4. Lựa chọn loại tour:\n- Tour trọn gói vs tour tự túc\n- Tour nhóm vs tour riêng\n\n5. Kiểm tra chất lượng:\n- Đọc review từ khách hàng\n- Kiểm tra uy tín công ty\n- Xem hình ảnh thực tế",
      hinh_anh: "/images/cards/card-02.jpg",
      danh_muc: "Tips du lịch",
      tags: ["Ngân sách", "Tour", "Mẹo", "Du lịch"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-28"),
    },
    {
      tieu_de: "Thái Lan - Điểm Đến Lý Tưởng Cho Du Lịch Quốc Tế",
      slug: "thai-lan-diem-den-ly-tuong-cho-du-lich-quoc-te",
      mo_ta_ngan: "Khám phá đất nước Thái Lan với văn hóa đặc sắc, ẩm thực phong phú và những điểm đến nổi tiếng...",
      noi_dung: "Thái Lan - xứ sở chùa vàng, là điểm đến lý tưởng cho du lịch quốc tế với nhiều điểm đến hấp dẫn.\n\nBangkok:\n- Chùa Wat Phra Kaew\n- Chùa Wat Pho\n- Chợ nổi Damnoen Saduak\n- Khao San Road\n\nChiang Mai:\n- Chùa Doi Suthep\n- Elephant Nature Park\n- Night Bazaar\n- Cooking class\n\nPhuket:\n- Bãi biển Patong\n- Vịnh Phang Nga\n- Đảo Phi Phi\n- Snorkeling\n\nẨm thực:\n- Pad Thai\n- Tom Yum Goong\n- Mango Sticky Rice\n- Street food\n\nVăn hóa:\n- Lễ hội Songkran\n- Muay Thai\n- Massage Thái\n- Chùa chiền",
      hinh_anh: "/images/cards/card-03.jpg",
      danh_muc: "Du lịch quốc tế",
      tags: ["Thái Lan", "Du lịch quốc tế", "Châu Á", "Du lịch"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-25"),
    },
    {
      tieu_de: "Hạ Long - Kỳ Quan Thiên Nhiên Thế Giới",
      slug: "ha-long-ky-quan-thien-nhien-the-gioi",
      mo_ta_ngan: "Trải nghiệm vịnh Hạ Long với hàng nghìn đảo đá vôi kỳ vĩ, hang động bí ẩn và cảnh quan thiên nhiên tuyệt đẹp...",
      noi_dung: "Vịnh Hạ Long - kỳ quan thiên nhiên thế giới, nằm ở vịnh Bắc Bộ. Vịnh có hơn 1.600 đảo đá vôi và đảo đá vôi, tạo nên một cảnh quan độc đáo.\n\nĐiểm tham quan:\n- Hang Sửng Sốt: Hang động lớn và đẹp nhất\n- Hang Đầu Gỗ: Hang động với nhiều nhũ đá\n- Đảo Ti Tốp: Đảo với bãi biển đẹp\n- Đảo Cát Bà: Đảo lớn nhất với nhiều hoạt động\n\nHoạt động:\n- Du thuyền trên vịnh\n- Kayaking\n- Tham quan hang động\n- Tắm biển\n- Leo núi\n\nThời gian tốt nhất:\n- Tháng 3-5: Thời tiết mát mẻ\n- Tháng 9-11: Thời tiết đẹp, ít mưa\n\nLưu ý:\n- Mang theo áo khoác\n- Mang theo kem chống nắng\n- Đặt tour sớm",
      hinh_anh: findDestinationImage(destinationsData, "Hạ Long") || findDestinationImage(destinationsData, "Quảng Ninh") || "/images/cards/card-01.jpg",
      danh_muc: "Du lịch trong nước",
      tags: ["Hạ Long", "Du lịch", "Việt Nam", "Kỳ quan"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-22"),
    },
    {
      tieu_de: "Nhật Bản - Xứ Sở Hoa Anh Đào",
      slug: "nhat-ban-xu-so-hoa-anh-dao",
      mo_ta_ngan: "Khám phá Nhật Bản với văn hóa truyền thống độc đáo, ẩm thực tinh tế và cảnh quan thiên nhiên tuyệt đẹp...",
      noi_dung: "Nhật Bản - xứ sở mặt trời mọc, là điểm đến lý tưởng với văn hóa độc đáo và cảnh quan tuyệt đẹp.\n\nTokyo:\n- Tháp Tokyo\n- Chùa Senso-ji\n- Shibuya Crossing\n- Harajuku\n\nKyoto:\n- Chùa Fushimi Inari\n- Kinkaku-ji (Chùa Vàng)\n- Arashiyama Bamboo Grove\n- Gion District\n\nOsaka:\n- Lâu đài Osaka\n- Dotonbori\n- Universal Studios Japan\n- Ẩm thực đường phố\n\nMùa hoa anh đào:\n- Tháng 3-4: Thời điểm hoa anh đào nở\n- Hanami: Lễ hội ngắm hoa anh đào\n\nẨm thực:\n- Sushi\n- Ramen\n- Tempura\n- Wagyu beef",
      hinh_anh: "/images/cards/card-02.jpg",
      danh_muc: "Du lịch quốc tế",
      tags: ["Nhật Bản", "Du lịch quốc tế", "Châu Á", "Hoa anh đào"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-20"),
    },
    {
      tieu_de: "Mẹo Đóng Gói Hành Lý Thông Minh Cho Chuyến Du Lịch",
      slug: "meo-dong-goi-hanh-ly-thong-minh-cho-chuyen-du-lich",
      mo_ta_ngan: "Những bí quyết đóng gói hành lý hiệu quả, tiết kiệm không gian và đảm bảo bạn có đủ mọi thứ cần thiết...",
      noi_dung: "Đóng gói hành lý thông minh giúp bạn tiết kiệm không gian và tránh quên đồ. Dưới đây là những mẹo hay:\n\n1. Lập danh sách:\n- Viết ra tất cả những gì cần mang\n- Kiểm tra lại trước khi đóng\n\n2. Cuộn quần áo:\n- Cuộn thay vì gấp tiết kiệm không gian\n- Đặt quần áo nặng ở dưới\n\n3. Sử dụng túi nén:\n- Túi nén giúp giảm thể tích\n- Đặc biệt hữu ích cho áo khoác\n\n4. Tận dụng không gian:\n- Đặt đồ trong giày\n- Sử dụng các ngăn nhỏ\n\n5. Mang đồ đa năng:\n- Quần áo có thể mix & match\n- Đồ có thể mặc nhiều cách\n\n6. Kiểm tra trọng lượng:\n- Đảm bảo không vượt quá giới hạn\n- Cân hành lý trước khi đi",
      hinh_anh: "/images/cards/card-03.jpg",
      danh_muc: "Tips du lịch",
      tags: ["Hành lý", "Mẹo", "Du lịch", "Chuẩn bị"],
      trang_thai: "published",
      ngay_dang: new Date("2025-10-18"),
    },
  ];

  for (const data of blogData) {
    const blog = await prisma.blog.upsert({
      where: { slug: data.slug },
      update: {
        ...data,
        tac_gia_id: admin.id,
      },
      create: {
        ...data,
        tac_gia_id: admin.id,
      },
    });
    blogs.push(blog);
  }

  console.log(`📝 Created ${blogs.length} blog posts`);

  console.log('✅ TravelBook database seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@travelbook.com / admin123');
  console.log('   Customer: khach1@example.com / 123456');
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
