import { Exercise } from '../types';

// Danh sách 20 bài tập cơ bản có hướng dẫn chi tiết bằng tiếng Việt
export const INITIAL_EXERCISES: Exercise[] = [
  // --- NGỰC ---
  {
    id: 'chest-bench-press',
    name: 'Bench Press',
    category: 'Ngực',
    muscleGroups: ['Ngực giữa', 'Vai trước', 'Tay sau'],
    description: 'Bài tập đẩy tạ đòn trên ghế phẳng là vua của các bài phát triển khối lượng cơ ngực toàn diện.',
    instructions: [
      'Nằm ngửa trên ghế phẳng, mắt nhìn thẳng lên thanh tạ đòn.',
      'Hai tay nắm thanh đòn rộng hơn vai một chút, siết chặt xương bả vai xuống ghế.',
      'Hít sâu, hạ thanh đòn chậm rãi có kiểm soát xuống phần giữa ngực.',
      'Thở ra và đẩy mạnh thanh đòn lên vị trí ban đầu mà không khóa khớp khuỷu tay.'
    ]
  },
  {
    id: 'chest-incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'Ngực',
    muscleGroups: ['Ngực trên', 'Vai trước', 'Tay sau'],
    description: 'Đẩy tạ đơn ghế dốc lên tập trung phát triển ngực trên và độ dày cơ vai trước.',
    instructions: [
      'Điều chỉnh ghế dốc khoảng 30 - 45 độ.',
      'Cầm tạ đơn hai bên đùi, dùng đầu gối hất tạ lên ngang ngực.',
      'Đẩy tạ lên cao trên ngực, giữ cổ tay thẳng.',
      'Hạ tạ xuống từ từ cảm nhận cơ ngực trên căng giãn tối đa rồi đẩy lên.'
    ]
  },
  {
    id: 'chest-push-up',
    name: 'Push-up',
    category: 'Ngực',
    isBodyweight: true,
    muscleGroups: ['Ngực', 'Cơ bụng', 'Tay sau'],
    description: 'Hít đất là bài tập thể trọng kinh điển củng cố sức mạnh ngực, vai và độ ổn định cơ lõi.',
    instructions: [
      'Chống hai tay xuống sàn rộng bằng vai, thân người tạo thành một đường thẳng từ đầu đến gót chân.',
      'Siết chặt mông và cơ bụng, hạ thấp ngực xuống cách sàn khoảng 2-3 cm.',
      'Đẩy dứt khoát cơ thể trở lại vị trí ban đầu trong khi giữ lưng thẳng.'
    ]
  },
  {
    id: 'chest-dumbbell-fly',
    name: 'Dumbbell Fly',
    category: 'Ngực',
    muscleGroups: ['Ngực', 'Ngực trong'],
    description: 'Bài tập mở rộng ngực với tạ đơn giúp kéo giãn tối đa sợi cơ ngực và định hình nét cắt cơ ngực.',
    instructions: [
      'Nằm trên ghế phẳng, hai tay cầm tạ giơ thẳng phía trên ngực, khuỷu tay hơi cong nhẹ.',
      'Mở rộng cánh tay sang hai bên thành hình vòng cung cho đến khi cảm thấy ngực căng.',
      'Dùng lực cơ ngực ép hai tạ trở lại vị trí ban đầu.'
    ]
  },
  {
    id: 'chest-cable-crossover',
    name: 'Cable Crossover',
    category: 'Ngực',
    muscleGroups: ['Ngực dưới', 'Ngực trong'],
    description: 'Ép ngực với dây cáp tạo áp lực căng liên tục lên cơ ngực trong toàn bộ biên độ chuyển động.',
    instructions: [
      'Đứng giữa máy kéo cáp, cài ròng rọc ở vị trí cao, hai tay cầm tay kéo.',
      'Bước một chân lên trước để giữ thăng bằng, hơi đổ người về trước.',
      'Kéo hai tay vòng cung xuống phía trước ngực và chạm nhẹ vào nhau.',
      'Từ từ mở tay về vị trí căng ngực rồi lặp lại.'
    ]
  },

  // --- LƯNG ---
  {
    id: 'back-deadlift',
    name: 'Deadlift',
    category: 'Lưng',
    muscleGroups: ['Lưng dưới', 'Xô', 'Mông', 'Đùi sau'],
    description: 'Bài tập phức hợp toàn thân xây dựng sức mạnh bùng nổ và độ dày lưng lưng dưới vượt trội.',
    instructions: [
      'Đứng hai chân rộng bằng hông, thanh đòn sát cẳng chân.',
      'Cúi người gập hông nắm thanh đòn, giữ lưng thẳng, ngực ưỡn, vai hơi hướng về phía trước.',
      'Dồn lực vào gót chân kéo tạ đứng thẳng lên, siết chặt mông ở đỉnh chuyển động.',
      'Hạ thanh đòn xuống sát ống chân có kiểm soát.'
    ]
  },
  {
    id: 'back-pull-up',
    name: 'Pull-up',
    category: 'Lưng',
    isBodyweight: true,
    muscleGroups: ['Cơ xô', 'Lưng trên', 'Bắp tay trước'],
    description: 'Hít xà đơn giúp mở rộng chiều ngang của lưng hình chữ V lý tưởng.',
    instructions: [
      'Hai tay nắm xà ngang với độ rộng lớn hơn vai, lòng bàn tay hướng ra ngoài.',
      'Kéo người lên cho đến khi cằm vượt qua thanh xà, tập trung kéo cùi chỏ xuống hông.',
      'Giữ lại 1 giây rồi hạ người xuống từ từ cho tới khi cánh tay duỗi thẳng hoàn toàn.'
    ]
  },
  {
    id: 'back-lat-pulldown',
    name: 'Lat Pulldown',
    category: 'Lưng',
    muscleGroups: ['Cơ xô', 'Lưng giữa'],
    description: 'Kéo xô máy tạ giúp kiểm soát chuyển động cô lập nhóm cơ xô và phát triển độ rộng lưng.',
    instructions: [
      'Ngồi vào máy, cố định đùi dưới đệm gối, hai tay nắm thanh đòn rộng hơn vai.',
      'Hơi ngả người về sau khoảng 10-15 độ, ưỡn ngực.',
      'Kéo thanh đòn xuống ngang xương quai xanh, ép chặt cơ xô lại.',
      'Nhả thanh đòn từ từ lên đỉnh chuyển động.'
    ]
  },
  {
    id: 'back-cable-row',
    name: 'Cable Row',
    category: 'Lưng',
    muscleGroups: ['Lưng giữa', 'Cơ trám', 'Xô'],
    description: 'Kéo cáp ngồi tác động vào độ dày lưng giữa và cải thiện tư thế đứng.',
    instructions: [
      'Ngồi vào máy kéo cáp, đặt chân lên bàn đạp, đầu gối hơi chùng nhẹ.',
      'Lưng thẳng, hai tay nắm chặt tay cầm chữ V.',
      'Kéo tay cầm về phía rốn đồng thời siết mạnh hai xương bả vai lại với nhau.',
      'Dãn tay về trước từ từ cảm nhận lưng kéo giãn.'
    ]
  },
  {
    id: 'back-dumbbell-row',
    name: 'Dumbbell Row',
    category: 'Lưng',
    muscleGroups: ['Cơ xô', 'Lưng trên'],
    description: 'Kéo tạ đơn một tay giúp khắc phục sự mất cân bằng giữa hai bên cơ lưng.',
    instructions: [
      'Đặt một đầu gối và một bàn tay cùng bên lên ghế phẳng, giữ lưng song song sàn nhà.',
      'Tay còn lại cầm tạ đơn buông thẳng xuống.',
      'Kéo tạ đơn về phía hông, giữ cùi chỏ sát mạn sườn và siết cơ xô.',
      'Hạ tạ xuống chậm rãi và lặp lại.'
    ]
  },

  // --- CHÂN ---
  {
    id: 'leg-squat',
    name: 'Squat',
    category: 'Chân',
    muscleGroups: ['Cơ tứ đầu', 'Mông', 'Đùi sau', 'Cơ lõi'],
    description: 'Vua của các bài tập chân giúp kích thích sản sinh testosterone và phát triển sức mạnh toàn thân.',
    instructions: [
      'Đặt thanh đòn ngang vai trên (cơ cầu vai), chân rộng bằng vai, mũi chân xoay nhẹ ra ngoài.',
      'Hít sâu, siết bụng, gập hông và đầu gối hạ người xuống như đang ngồi ghế.',
      'Hạ cho tới khi đùi song song hoặc sâu hơn mặt sàn.',
      'Đạp mạnh gót chân đẩy người đứng thẳng dậy và thở ra.'
    ]
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'Chân',
    muscleGroups: ['Đùi trước', 'Mông'],
    description: 'Đạp đùi máy nghiêng cho phép nâng tải trọng lớn an toàn cho cột sống lưng.',
    instructions: [
      'Ngồi vào máy, đặt hai bàn chân rộng bằng vai trên bàn đạp.',
      'Mở chốt khóa an toàn, hạ bàn đạp xuống từ từ cho tới khi đầu gối gập khoảng 90 độ.',
      'Dùng lực cơ đùi và gót chân đẩy bàn đạp lên, chú ý không khóa khớp đầu gối.'
    ]
  },
  {
    id: 'leg-romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'Chân',
    muscleGroups: ['Đùi sau', 'Mông', 'Lưng dưới'],
    description: 'Bài tập gập hông kéo giãn sâu nhóm cơ đùi sau và kích thích cơ mông phát triển.',
    instructions: [
      'Đứng thẳng cầm tạ đòn hoặc tạ đơn trước đùi, đầu gối hơi chùng nhẹ và khóa góc này.',
      'Đẩy hông ra phía sau, cúi thân trên về trước trong khi giữ lưng tuyệt đối thẳng.',
      'Hạ tạ qua đầu gối cho tới khi cảm nhận đùi sau căng hết cỡ.',
      'Siết mông đẩy hông về phía trước để trở về vị trí ban đầu.'
    ]
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    category: 'Chân',
    muscleGroups: ['Đùi sau'],
    description: 'Móc đùi sau máy nằm/ngồi cô lập hoàn toàn chuỗi cơ đùi sau.',
    instructions: [
      'Nằm úp trên máy, cài đệm lăn phía sau mắt cá chân.',
      'Hai tay nắm chặt tay cầm cố định thân người.',
      'Gập cẳng chân kéo gót chân về phía mông càng sát càng tốt.',
      'Dừng 1 giây rồi hạ chân xuống có kiểm soát.'
    ]
  },
  {
    id: 'leg-calf-raise',
    name: 'Calf Raise',
    category: 'Chân',
    muscleGroups: ['Bắp chuối'],
    description: 'Nhón bắp chân giúp xây dựng đôi chân săn chắc, khỏe khoắn và hỗ trợ bật nhảy.',
    instructions: [
      'Đứng nửa bàn chân trước lên bục, gót chân thả tự do ra ngoài.',
      'Hạ gót chân xuống sâu nhất có thể để căng cơ bắp chuối.',
      'Dồn lực vào mũi chân nhón người lên cao hết mức có thể, siết bắp chuối trong 1 giây.',
      'Hạ gót xuống từ từ và lặp lại.'
    ]
  },

  // --- VAI ---
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    category: 'Vai',
    muscleGroups: ['Vai trước', 'Vai giữa', 'Tay sau'],
    description: 'Đẩy vai tạ đòn/tạ đơn qua đầu là bài tập nền tảng xây dựng khối lượng bờ vai vạm vỡ.',
    instructions: [
      'Ngồi trên ghế tựa lưng dựng đứng hoặc đứng thẳng, tạ ngang tầm vai.',
      'Cổ tay thẳng, cùi chỏ mở vừa phải khoảng 45 độ so với thân.',
      'Đẩy tạ dứt khoát thẳng lên trên đỉnh đầu.',
      'Hạ tạ chậm rãi về ngang tầm tai rồi tiếp tục.'
    ]
  },
  {
    id: 'shoulder-lateral-raise',
    name: 'Lateral Raise',
    category: 'Vai',
    muscleGroups: ['Vai giữa'],
    description: 'Dang tạ đơn sang ngang giúp bờ vai rộng và tạo form tam giác chữ V quyến rũ.',
    instructions: [
      'Đứng thẳng, hai tay cầm tạ đơn buông nhẹ hai bên hông, khuỷu tay hơi cong nhẹ.',
      'Nâng hai tạ sang ngang hai bên cho tới khi tay song song với mặt sàn.',
      'Dẫn hướng bằng cùi chỏ, giữ lại 1 nhịp ở đỉnh rồi hạ tạ xuống chậm.'
    ]
  },
  {
    id: 'shoulder-face-pull',
    name: 'Face Pull',
    category: 'Vai',
    muscleGroups: ['Vai sau', 'Lưng trên', 'Cơ xoay vai'],
    description: 'Kéo dây thừng về mặt giúp củng cố vai sau, khớp vai và sửa tư thế gù lưng.',
    instructions: [
      'Gắn dây thừng vào ròng rọc máy kéo ngang tầm mắt.',
      'Nắm dây thừng với ngón tay cái hướng về phía bạn, lùi lại vài bước.',
      'Kéo dây thừng về phía mắt, tách hai đầu dây sang hai bên đồng thời xoay ngoài khớp vai.',
      'Ép chặt cơ vai sau và giữ 1 giây trước khi thả về.'
    ]
  },

  // --- TAY ---
  {
    id: 'arm-bicep-curl',
    name: 'Bicep Curl',
    category: 'Tay',
    muscleGroups: ['Bắp tay trước'],
    description: 'Cuốn tạ tay trước cổ điển giúp tăng độ phồng và đỉnh chuột bắp tay.',
    instructions: [
      'Đứng thẳng, hai tay cầm tạ đơn hoặc tạ đòn dọc thân người, cùi chỏ ép sát eo.',
      'Chỉ gập cẳng tay cuốn tạ lên phía trước ngực trong khi giữ cùi chỏ cố định.',
      'Siết chặt bắp tay ở điểm cao nhất trong 1 giây.',
      'Hạ tạ xuống từ từ có kiểm soát để kéo giãn bắp tay.'
    ]
  },
  {
    id: 'arm-tricep-pushdown',
    name: 'Tricep Pushdown',
    category: 'Tay',
    muscleGroups: ['Bắp tay sau'],
    description: 'Đẩy cáp tay sau cô lập và phát triển độ dày 2/3 cánh tay trên.',
    instructions: [
      'Đứng trước máy kéo cáp ròng rọc cao, gắn thanh chữ V hoặc dây thừng.',
      'Hai tay nắm tay cầm, khép chặt khuỷu tay vào sát hai bên mạn sườn.',
      'Dùng cơ tay sau đẩy thanh cầm xuống thẳng tay chạm đùi.',
      'Siết chặt tay sau 1 giây rồi từ từ thả tay lên ngang ngực.'
    ]
  },

  // --- THỂ TRỌNG (Không cần tạ) ---
  {
    id: 'bw-burpee',
    name: 'Burpee',
    category: 'Thể Trọng',
    muscleGroups: ['Toàn thân', 'Tim mạch'],
    description: 'Bài tập toàn thân cường độ cao kết hợp squat, hít đất và nhảy — đốt calo cực kỳ hiệu quả.',
    instructions: [
      'Đứng thẳng, sau đó ngồi xổm xuống và đặt hai tay trên sàn.',
      'Nhảy hai chân ra sau về tư thế hít đất, thực hiện một cái hít đất.',
      'Nhảy hai chân về gần tay, đứng dậy và nhảy vọt lên cao, hai tay vỗ trên đầu.',
      'Đây được tính là 1 lần. Thực hiện liên tục không nghỉ.'
    ]
  },
  {
    id: 'bw-plank',
    name: 'Plank',
    category: 'Thể Trọng',
    muscleGroups: ['Cơ lõi', 'Cơ bụng', 'Lưng dưới'],
    description: 'Tư thế chống cơ lõi giúp xây dựng nền tảng sức mạnh bụng, lưng và ổn định cột sống.',
    instructions: [
      'Nằm úp, chống hai cẳng tay và mũi chân xuống sàn, khuỷu tay thẳng dưới vai.',
      'Nâng hông lên tạo thành một đường thẳng từ đầu đến gót chân.',
      'Siết chặt cơ bụng, mông và không để hông võng xuống hay nhô lên.',
      'Giữ tư thế theo thời gian quy định, thở đều và bình thường.'
    ]
  },
  {
    id: 'bw-mountain-climber',
    name: 'Mountain Climber',
    category: 'Thể Trọng',
    muscleGroups: ['Cơ lõi', 'Cơ bụng', 'Vai', 'Tim mạch'],
    description: 'Leo núi tại chỗ đốt cháy cơ bụng và tăng nhịp tim cực nhanh — bài cardio kết hợp core hoàn hảo.',
    instructions: [
      'Bắt đầu từ tư thế hít đất cao, hai tay thẳng dưới vai.',
      'Kéo nhanh đầu gối phải về phía ngực, đồng thời duỗi chân trái ra.',
      'Đổi chân liên tục như đang chạy bộ theo chiều nằm ngang.',
      'Giữ hông thẳng, không nhô lên hay xoắn hông sang hai bên.'
    ]
  },
  {
    id: 'bw-jump-squat',
    name: 'Jump Squat',
    category: 'Thể Trọng',
    muscleGroups: ['Đùi trước', 'Mông', 'Bắp chuối', 'Tim mạch'],
    description: 'Squat kết hợp bật nhảy tăng sức mạnh bùng nổ cơ chân và đốt calo hiệu quả.',
    instructions: [
      'Đứng chân rộng bằng vai, ngồi squat xuống đến khi đùi song song sàn.',
      'Từ điểm thấp nhất, bùng nổ bật nhảy lên cao hết mức có thể.',
      'Tiếp đất nhẹ nhàng bằng mũi chân trước rồi gót chân, gập đầu gối để giảm chấn.',
      'Ngay lập tức chuyển sang lần squat tiếp theo.'
    ]
  },
  {
    id: 'bw-lunge',
    name: 'Lunge',
    category: 'Thể Trọng',
    muscleGroups: ['Đùi trước', 'Mông', 'Đùi sau'],
    description: 'Bước chân về trước tác động sâu vào cơ đùi và mông, đồng thời cải thiện sự thăng bằng.',
    instructions: [
      'Đứng thẳng, hai tay thả tự nhiên hoặc chống hông.',
      'Bước một chân về phía trước dài khoảng hai bước chân.',
      'Hạ đầu gối sau xuống gần chạm sàn, đầu gối trước không vượt qua ngón chân.',
      'Đẩy gót chân trước xuống sàn để đứng dậy, đổi chân và lặp lại.'
    ]
  },
  {
    id: 'bw-glute-bridge',
    name: 'Glute Bridge',
    category: 'Thể Trọng',
    muscleGroups: ['Mông', 'Đùi sau', 'Lưng dưới'],
    description: 'Nâng hông nằm ngửa kích hoạt và siết chặt cơ mông, đặc biệt tốt cho người ngồi nhiều.',
    instructions: [
      'Nằm ngửa, đầu gối gập, hai bàn chân đặt phẳng trên sàn gần mông.',
      'Hai tay duỗi thẳng dọc thân người, lòng bàn tay úp xuống sàn.',
      'Siết mông và đẩy hông lên cao cho tới khi đùi và thân tạo thành đường thẳng.',
      'Giữ siết mông 2 giây ở đỉnh rồi hạ hông xuống chậm rãi.'
    ]
  },
  {
    id: 'bw-diamond-pushup',
    name: 'Diamond Push-up',
    category: 'Thể Trọng',
    muscleGroups: ['Bắp tay sau', 'Ngực trong', 'Vai trước'],
    description: 'Hít đất tay kim cương siết chặt và phát triển cơ tay sau hiệu quả mà không cần tạ.',
    instructions: [
      'Chống hai tay xuống sàn, hai ngón tay cái và ngón trỏ chạm nhau tạo hình kim cương.',
      'Đặt tay ở giữa ngực, giữ thân người thẳng từ đầu đến gót chân.',
      'Hạ ngực xuống gần chạm tay, khuỷu tay gập về phía sau.',
      'Đẩy dứt khoát trở lên vị trí ban đầu.'
    ]
  },
  {
    id: 'bw-wide-pushup',
    name: 'Wide Push-up',
    category: 'Thể Trọng',
    muscleGroups: ['Ngực', 'Vai trước', 'Bắp tay sau'],
    description: 'Hít đất tay rộng tập trung vào cơ ngực ngoài, thay thế hoàn toàn máy Pec Deck không cần gym.',
    instructions: [
      'Chống hai tay rộng hơn vai khoảng 1.5 lần, ngón tay hướng về phía trước.',
      'Giữ thân người thẳng như tấm ván từ đầu đến gót chân.',
      'Hạ ngực xuống sát sàn, cảm nhận cơ ngực ngoài kéo giãn.',
      'Đẩy lên bằng lực cơ ngực là chính.'
    ]
  },
  {
    id: 'bw-pike-pushup',
    name: 'Pike Push-up',
    category: 'Thể Trọng',
    muscleGroups: ['Vai trước', 'Vai giữa', 'Bắp tay sau'],
    description: 'Hít đất tư thế chữ A giúp phát triển cơ vai mà không cần tạ — nền tảng cho handstand push-up.',
    instructions: [
      'Bắt đầu tư thế hít đất, sau đó đẩy mông lên cao tạo hình chữ A ngược.',
      'Hai tay đặt rộng bằng vai, đầu hướng xuống đất giữa hai tay.',
      'Gập khuỷu tay hạ đầu xuống về phía sàn giữa hai tay.',
      'Đẩy dứt khoát trở lên tư thế chữ A.'
    ]
  },
  {
    id: 'bw-tricep-dip',
    name: 'Tricep Dip',
    category: 'Thể Trọng',
    muscleGroups: ['Bắp tay sau', 'Ngực dưới', 'Vai trước'],
    description: 'Chống tay sau ghế phát triển cơ tay sau và ngực dưới — chỉ cần một chiếc ghế.',
    instructions: [
      'Đặt hai tay sau lưng lên mép ghế, ngón tay hướng về phía trước.',
      'Chân duỗi thẳng hoặc gập nhẹ, trọng lượng dồn vào hai tay.',
      'Hạ người xuống bằng cách gập khuỷu tay cho tới khi khuỷu tay gập khoảng 90 độ.',
      'Đẩy lên dứt khoát trở lại vị trí ban đầu, không khóa khuỷu tay.'
    ]
  },
  {
    id: 'bw-superman',
    name: 'Superman',
    category: 'Thể Trọng',
    muscleGroups: ['Lưng dưới', 'Mông', 'Lưng trên'],
    description: 'Tư thế siêu nhân nằm úp giúp củng cố lưng dưới và ngăn ngừa đau lưng hiệu quả.',
    instructions: [
      'Nằm úp trên sàn, hai tay duỗi thẳng về phía trước như siêu nhân bay.',
      'Đồng thời nâng hai tay, ngực và hai chân lên khỏi mặt sàn.',
      'Siết chặt cơ lưng dưới và mông ở điểm cao nhất, giữ 2-3 giây.',
      'Hạ người xuống chậm rãi và lặp lại.'
    ]
  },
  {
    id: 'bw-high-knees',
    name: 'High Knees',
    category: 'Thể Trọng',
    muscleGroups: ['Tim mạch', 'Cơ bụng', 'Đùi trước'],
    description: 'Chạy tại chỗ nâng gối cao làm nóng cơ thể nhanh và cải thiện sức bền tim mạch.',
    instructions: [
      'Đứng thẳng, bắt đầu chạy tại chỗ với tốc độ nhanh.',
      'Nâng đầu gối lên cao ngang hông hoặc cao hơn mỗi bước.',
      'Hai tay đánh theo nhịp chạy, giữ tư thế thẳng đứng.',
      'Duy trì nhịp điệu nhanh, hít thở đều đặn.'
    ]
  },
  {
    id: 'bw-wall-sit',
    name: 'Wall Sit',
    category: 'Thể Trọng',
    muscleGroups: ['Đùi trước', 'Mông', 'Bắp chuối'],
    description: 'Ngồi tường tĩnh giúp rèn luyện sức bền cơ đùi trước và ý chí tập luyện.',
    instructions: [
      'Đứng tựa lưng vào tường, bước chân ra phía trước khoảng hai bước.',
      'Trượt lưng xuống tường cho đến khi đùi song song với sàn như tư thế ngồi ghế.',
      'Giữ lưng thẳng áp vào tường, hai tay để tự nhiên trước đùi hoặc chống hông.',
      'Giữ tư thế theo thời gian quy định, thở đều.'
    ]
  },
  {
    id: 'bw-crunches',
    name: 'Crunches',
    category: 'Thể Trọng',
    muscleGroups: ['Cơ bụng trên'],
    description: 'Gập bụng cơ bản tác động trực tiếp vào cơ bụng thẳng, xây dựng múi bụng rõ nét.',
    instructions: [
      'Nằm ngửa, đầu gối gập vuông góc, hai bàn chân đặt phẳng trên sàn.',
      'Hai tay đặt nhẹ sau đầu hoặc khoanh tay trước ngực.',
      'Siết cơ bụng cuộn phần trên thân mình lên khỏi sàn, chỉ cần vai nhấc lên khoảng 30 cm.',
      'Hạ xuống chậm rãi, không để đầu chạm sàn hoàn toàn để duy trì căng cơ.'
    ]
  },
  {
    id: 'bw-leg-raise',
    name: 'Leg Raise',
    category: 'Thể Trọng',
    isBodyweight: true,
    muscleGroups: ['Cơ bụng dưới', 'Cơ mào chậu'],
    description: 'Nâng chân nằm ngửa tập trung vào phần bụng dưới — vùng khó tập nhất của cơ bụng.',
    instructions: [
      'Nằm ngửa, hai tay đặt dưới mông hoặc dọc thân để ổn định lưng dưới.',
      'Giữ hai chân thẳng (hoặc hơi cong nhẹ), nâng chân lên cho tới khi vuông góc với sàn.',
      'Hạ chân xuống chậm rãi, dừng cách sàn khoảng 5 cm để không tạo đà.',
      'Siết bụng trong suốt quá trình, đừng để lưng dưới cong khỏi sàn.'
    ]
  }
];

// Hàm kiểm tra bài tập có phải bài thể trọng (không tạ) hay không
export const isExerciseBodyweight = (exerciseId: string, category?: string): boolean => {
  if (category === 'Thể Trọng') return true;
  if (exerciseId.startsWith('bw-') || exerciseId === 'chest-push-up' || exerciseId === 'back-pull-up') return true;
  const ex = INITIAL_EXERCISES.find((e) => e.id === exerciseId);
  return Boolean(ex?.isBodyweight || ex?.category === 'Thể Trọng');
};

