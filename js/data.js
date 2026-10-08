// 계약 상황 이벤트(퀴즈) / 결과 대사 / 선택형 돌발 이벤트 데이터
//
// mission 필드
//   buyerId    : buyers.js 의 바이어 초상화/성격 id
//   flag / country / company / person : 바이어 표시 정보
//   buyer      : 호환용 표시 이름
//   cargo      : 화물
//   terms      : 주요 조건 칩 (최대 3개)
//   risk       : 위험도 1~3 (★ 표시)
//   reward     : 성공 보상 (캐릭터 배율 적용 전)
//   message    : 계약 상황 (바이어 대사 + 사건)
//   options    : 행동 선택 카드 [{ icon, text }]
//   answer     : 정답 index
//   explanation: 해설
export const missions = [
  {
    buyerId: 'jp', flag: '🇯🇵', country: '일본', company: '사토 상사', person: '사토 유키',
    buyer: '🇯🇵 일본 바이어', cargo: '전자부품 1 FEU',
    terms: ['FOB Busan', 'T/T 30/70', '납기 D-5'], risk: 1, reward: 5000000,
    message: 'FOB Busan 조건으로 전자부품을 보내 달라며 납기도 하루 줄여 달라고 합니다. "그런데 화물 위험은 언제부터 저희 책임이죠?"라고 묻습니다. 어떻게 설명할까요?',
    options: [
      { icon: '🚢', text: '부산항에서 본선에 적재되는 순간부터 바이어 책임이라고 설명한다' },
      { icon: '🏯', text: '오사카항에 도착할 때부터 바이어 책임이라고 설명한다' },
      { icon: '🏬', text: '바이어 창고에 입고될 때부터 바이어 책임이라고 설명한다' }
    ],
    answer: 0,
    explanation: 'FOB에서는 선적항에서 본선에 적재될 때 위험이 매수인에게 이전됩니다.'
  },
  {
    buyerId: 'us', flag: '🇺🇸', country: '미국', company: '텍사스 트레이딩', person: '마이크 존슨',
    buyer: '🇺🇸 미국 바이어', cargo: '산업용 펌프 2 FCL',
    terms: ['DDP Houston', 'L/C at sight', '관세 8%'], risk: 3, reward: 8000000,
    message: '"DDP로 보내주세요. 관세는 사장님이 알아서요♡" 휴스턴 세관의 관세 고지서가 벌써 눈앞에 아른거립니다. 통관과 관세 책임을 어떻게 정리할까요?',
    options: [
      { icon: '🏛️', text: '미국 세관이 알아서 면제해 줄 테니 걱정 말라고 답한다' },
      { icon: '🧾', text: '수입통관과 관세까지 우리가 부담한다고 보고 견적에 반영한다' },
      { icon: '🤝', text: '바이어가 도착 후 관세를 납부하도록 계약서에 적는다' }
    ],
    answer: 1,
    explanation: 'DDP(관세지급인도)는 매도인이 수입통관과 관세까지 모두 부담하는 최대 의무 조건입니다.'
  },
  {
    buyerId: 'de', flag: '🇩🇪', country: '독일', company: '뮐러 GmbH', person: '한나 뮐러',
    buyer: '🇩🇪 독일 바이어', cargo: '자동차 부품 1 FCL',
    terms: ['L/C at sight', 'CIF Hamburg', '최종선적일 경과'], risk: 3, reward: 7000000,
    message: 'L/C 최종선적일을 하루 넘긴 채 선적이 끝났습니다. 바이어는 "서류는 그대로 내세요. 은행이 모르겠죠?"라고 합니다. 어떻게 대응할까요?',
    options: [
      { icon: '🏦', text: '은행이 서류 하자로 지급을 거절할 수 있으니 L/C 조건 변경을 먼저 요청한다' },
      { icon: '🙆', text: '바이어가 괜찮다고 했으니 서류를 그대로 제출한다' },
      { icon: '💸', text: '세관에 벌금을 내면 해결되니 벌금을 낸다' }
    ],
    answer: 0,
    explanation: 'L/C 거래에서 선적 지연은 서류 하자(discrepancy)가 되어 은행이 대금 지급을 거절할 수 있습니다.'
  },
  {
    buyerId: 'vn', flag: '🇻🇳', country: '베트남', company: '하이퐁 임포트', person: '응우옌 린',
    buyer: '🇻🇳 베트남 바이어', cargo: '섬유 원단 3 LCL',
    terms: ['CIF Haiphong', 'T/T 100% 선적 전', '보험 미정'], risk: 2, reward: 6000000,
    message: 'CIF Haiphong으로 계약했는데 바이어가 "저는 보험 안 들었는데요?"라고 합니다. 선적은 내일입니다. 보험 문제를 어떻게 처리할까요?',
    options: [
      { icon: '⚓', text: '선사가 자동으로 보험을 들어주니 괜찮다고 답한다' },
      { icon: '📨', text: '매수인이 직접 보험에 가입해야 한다고 안내한다' },
      { icon: '🛡️', text: '매도인인 우리가 최소담보(ICC C) 조건으로 보험에 가입한다' }
    ],
    answer: 2,
    explanation: 'CIF에서는 매도인이 운임과 보험료를 부담하며, 최소담보(ICC C) 수준으로 보험에 가입합니다.'
  },
  {
    buyerId: 'ae', flag: '🇦🇪', country: 'UAE', company: '알 파라 트레이딩', person: '파티마 알 파라',
    buyer: '🇦🇪 두바이 바이어', cargo: '화장품 1 FCL',
    terms: ['CFR Jebel Ali', 'B/L 원본 3통', 'T/T 50/50'], risk: 2, reward: 9000000,
    message: '"B/L 원본 3통 중 2통을 낙타가 먹었습니다. 남은 1통으로 화물 찾을 수 있나요?" 바이어가 울먹입니다. 어떻게 안내할까요?',
    options: [
      { icon: '📜', text: '원본 1통만 제시해도 화물 인도가 가능하다고 안내한다' },
      { icon: '🗂️', text: '3통이 모두 있어야 하니 재발행을 기다리라고 한다' },
      { icon: '🖨️', text: '사본을 컬러로 출력해 제시하라고 한다' }
    ],
    answer: 0,
    explanation: '선하증권 원본은 보통 3통이 발행되며, 그중 1통만 제시해도 화물 인도가 가능하고 나머지는 무효가 됩니다.'
  },
  {
    buyerId: 'cn', flag: '🇨🇳', country: '중국', company: '광저우 프렌즈', person: '왕 리',
    buyer: '🇨🇳 중국 바이어', cargo: '생활용품 2 FCL',
    terms: ['EXW 공장', 'T/T 선금 100%', '적재 조건 미정'], risk: 1, reward: 4000000,
    message: '"EXW로 할게요. 공장 앞 트럭에 실어주는 건 서비스죠? 친구잖아요." 트럭은 이미 공장 앞에 와 있습니다. 적재 책임을 어떻게 정리할까요?',
    options: [
      { icon: '🏭', text: '매도인이 적재까지 해주는 게 당연하다며 그냥 실어준다' },
      { icon: '📦', text: '적재는 매수인 책임이라고 설명하고 별도 비용을 제시한다' },
      { icon: '🚚', text: '트럭 기사가 알아서 할 일이라고 넘긴다' }
    ],
    answer: 1,
    explanation: 'EXW(공장인도)는 매도인 의무가 가장 작은 조건으로, 차량 적재도 원칙적으로 매수인의 책임입니다.'
  },
  {
    buyerId: 'br', flag: '🇧🇷', country: '브라질', company: '리우 임포르타', person: '카를로스 실바',
    buyer: '🇧🇷 브라질 바이어', cargo: '의료기기 1 FCL',
    terms: ['FOB Busan', 'T/T 30/70', '원본 B/L 요청'], risk: 3, reward: 10000000,
    message: '"선금 30% 보냈어요! 70%는 B/L 사본 보고 바로 쏠게요. 원본은 미리 보내주세요~" 잔금은 아직입니다. 원본 B/L을 어떻게 다룰까요?',
    options: [
      { icon: '🔒', text: '잔금을 받은 뒤 원본 B/L을 송부한다' },
      { icon: '🏬', text: '바이어 창고에 입고된 뒤 잔금을 받기로 한다' },
      { icon: '💌', text: '친절하게 원본 B/L을 먼저 보내고 믿는다' }
    ],
    answer: 0,
    explanation: '원본 B/L을 넘기면 화물 통제권을 잃으므로, 잔금 수령 후 원본을 송부하는 것이 안전합니다.'
  },
  {
    buyerId: 'fr', flag: '🇫🇷', country: '프랑스', company: '파리 데코', person: '클레르 뒤퐁',
    buyer: '🇫🇷 프랑스 바이어', cargo: '조명 기구 1 FCL',
    terms: ['DAP Paris', 'L/C 60 days', 'HS 코드 정정'], risk: 2, reward: 6000000,
    message: 'HS 코드가 틀렸다며 파리 세관이 컨테이너를 잡았습니다. 바이어가 "국제 공통 자릿수까지만 맞추면 된대요!"라고 합니다. 몇 자리까지 정정해 신고할까요?',
    options: [
      { icon: '🔟', text: '10자리까지 국제 공통이라고 보고 10자리를 정정한다' },
      { icon: '4️⃣', text: '4자리까지 국제 공통이라고 보고 4자리만 정정한다' },
      { icon: '6️⃣', text: '앞 6자리가 국제 공통이므로 6자리를 기준으로 정정한다' }
    ],
    answer: 2,
    explanation: 'HS 코드는 앞 6자리가 국제 공통이며, 그 뒤 자리는 각국이 세분화하여 사용합니다.'
  }
];

// 선택형 돌발 이벤트 : 계약 2~3건마다 발생. 짧은 선택지로 대응하며 자본/멘탈(정수)에 영향.
// 정답·오답 판정과는 무관하다.
export const EVENT_EVERY_MIN = 2; // 최소 간격(계약 수)
export const EVENT_EVERY_MAX = 3; // 최대 간격
export const events = [
  {
    icon: '💱', title: '환율 급등',
    text: '달러 환율이 하루 만에 5% 뛰었습니다. 미국 바이어 대금이 막 입금됐습니다.',
    options: [
      { icon: '💵', label: '지금 바로 환전한다', cash: 2500000, mental: 0, result: '타이밍 적중! 환차익이 생겼습니다.' },
      { icon: '⏳', label: '조금 더 지켜본다', cash: 0, mental: -3, result: '다음 날 환율이 다시 내려왔습니다. 사장님은 밤새 환율 앱만 봤습니다.' }
    ]
  },
  {
    icon: '📑', title: '세관 서류 재제출 요청',
    text: '세관이 원산지 증명서를 다시 내라고 합니다. 마감은 내일 아침입니다.',
    options: [
      { icon: '🏃', label: '직원들이 밤새 다시 작성한다', cash: 0, mental: -8, result: '통관은 됐지만 직원들이 사장님을 노려봅니다.' },
      { icon: '💼', label: '관세사에게 맡긴다', cash: -700000, mental: 2, result: '수수료는 나갔지만 마음은 편합니다.' }
    ]
  },
  {
    icon: '🤑', title: '바이어의 갑작스러운 할인 요구',
    text: '일본 바이어가 계약 직전에 "10%만 깎아주세요. 우리 사이에."라고 합니다.',
    options: [
      { icon: '🙅', label: '정중히 거절한다', cash: 0, mental: -5, result: '바이어가 살짝 삐졌지만 계약은 유지됐습니다.' },
      { icon: '🤝', label: '5%만 깎아준다', cash: -1200000, mental: 4, result: '바이어가 기뻐하며 다음 오더를 약속(?)했습니다.' },
      { icon: '😭', label: '다 깎아준다', cash: -2400000, mental: -2, result: '바이어는 행복, 통장은 불행.' }
    ]
  },
  {
    icon: '🚢', title: '선적 지연',
    text: '선사가 출항을 3일 미뤘습니다. 배는 항구에, 바이어의 인내심은 바닥에 있습니다.',
    options: [
      { icon: '📞', label: '바이어에게 먼저 전화해 사과한다', cash: 0, mental: -4, result: '바이어가 "다음엔 조심하세요"라며 넘어갔습니다.' },
      { icon: '✈️', label: '급한 물량만 항공으로 보낸다', cash: -1800000, mental: 3, result: '비용은 아프지만 신뢰는 지켰습니다.' }
    ]
  },
  {
    icon: '✏️', title: '서류 오타 발견',
    text: '송장의 수량 숫자 하나가 틀렸습니다. 바이어는 아직 모릅니다.',
    options: [
      { icon: '📝', label: '바로 정정본을 보낸다', cash: 0, mental: -2, result: '바이어가 "꼼꼼하시네요"라고 했습니다. 다행입니다.' },
      { icon: '🤫', label: '모른 척한다', cash: -1500000, mental: -6, result: '세관이 발견했습니다. 벌금과 함께 사장님의 양심도 아팠습니다.' }
    ]
  },
  {
    icon: '☕', title: '커피머신 고장',
    text: '사장님, 커피머신이 고장 났습니다. 사무실의 생산성이 조용히 멈췄습니다.',
    options: [
      { icon: '🛒', label: '새 커피머신을 산다', cash: -500000, mental: 6, result: '사무실에 평화가 돌아왔습니다.' },
      { icon: '🍵', label: '믹스커피로 버틴다', cash: 0, mental: -4, result: '직원들의 눈빛이 식었습니다.' }
    ]
  },
  {
    icon: '🎁', title: '바이어의 감사 선물',
    text: '베트남 바이어가 감사 선물로 쌀국수 라면 한 박스를 보냈습니다.',
    options: [
      { icon: '🍜', label: '직원들과 나눠 먹는다', cash: 0, mental: 7, result: '사무실 멘탈이 회복됐습니다.' },
      { icon: '📦', label: '창고에 잘 보관한다', cash: 0, mental: 1, result: '라면은 조용히 유통기한을 향해 갑니다.' }
    ]
  },
  {
    icon: '🧾', title: '포워더 운임 인상 통보',
    text: '포워더가 "이번 달부터 운임 15% 인상입니다"라고 통보했습니다.',
    options: [
      { icon: '🔄', label: '다른 포워더 견적을 받는다', cash: -300000, mental: -3, result: '견적 비교에 하루를 썼지만 비용을 조금 아꼈습니다.' },
      { icon: '✅', label: '그냥 받아들인다', cash: -1000000, mental: 0, result: '빠르게 처리했지만 운임이 늘었습니다.' }
    ]
  },
  {
    icon: '🍻', title: '직원 회식 요청',
    text: '직원들이 회식을 요구합니다. 사장님 카드가 미리 울고 있습니다.',
    options: [
      { icon: '🍗', label: '오늘은 사장님이 쏜다', cash: -800000, mental: 8, result: '"사장님 최고!"라는 말이 들립니다. 진심인지는 모릅니다.' },
      { icon: '🙂', label: '다음 달에 하자고 한다', cash: 0, mental: -5, result: '"다음 달"은 언제나 다음 달입니다.' }
    ]
  },
  {
    icon: '👯', title: '중국 바이어의 더블 오더',
    text: '중국 바이어가 "친구니까" 두 배로 주문했습니다. 결제는 나중에 한다고 합니다.',
    options: [
      { icon: '📄', label: '선금을 받고 진행한다', cash: 2000000, mental: 0, result: '친구는 친구고 선금은 선금입니다.' },
      { icon: '🤗', label: '친구니까 믿고 진행한다', cash: 3500000, mental: -8, result: '결제가 늦어져 사장님은 매일 메신저를 확인합니다.' }
    ]
  }
];
