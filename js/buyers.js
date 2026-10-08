// 나라별 바이어 : 데이터 + 16×16 픽셀 흉상 초상화 + 표정 + 성격 대사
// rows  : 16줄 × 16칸 픽셀 맵 ('.' 은 투명)
// faces : 표정별 [눈썹줄(4), 눈줄(5), 입줄(8)] 의 얼굴 8칸(col 4~11) 교체 데이터
// bg    : 초상화 카드 배경 그라데이션 (국기 색 포인트)
// react : 계약 성공/실패 시 바이어 반응 대사
export const BUYER_PALETTE = {
  "k": "#2a2a35",
  "s": "#f3c6a0",
  "S": "#d9a27a",
  "e": "#1a1a24",
  "w": "#ffffff",
  "m": "#c84c4c",
  "b": "#f5a6a6",
  "t": "#ffffff",
  "g": "#4b6fb8",
  "y": "#ffd25a",
  "d": "#3b2a07"
};

export const buyers = [
  {
    "id": "jp",
    "code": "JP",
    "flag": "🇯🇵",
    "country": "일본",
    "tag": "공손형",
    "rows": [
      "....kkkkkkkk....",
      "..kkhhhhhhhhkk..",
      ".khhhhhhhhhhhhk.",
      ".khhhhHhhhhhhhk.",
      ".khhsssssssshhk.",
      ".khhsesssseshhk.",
      ".khhsssssssshhk.",
      ".khhsssssssshhk.",
      ".khhssmmmmsshhk.",
      "..khsssssssshk..",
      "...kssssssssk...",
      "....k.ssss.k....",
      "...kjjjttjjjk...",
      "..kjjjjtajjjjk..",
      ".kjjjjjjajjjjjjk",
      "kjjjjjjjjjjjjjjk"
    ],
    "palette": {
      "h": "#1b1b24",
      "H": "#3a3a4d",
      "j": "#1f3a6b",
      "a": "#c84c4c"
    },
    "bg": [
      "#f5f5f5",
      "#d9433b"
    ],
    "faces": {
      "normal": [
        "ssssssss",
        "sesssses",
        "ssmmmmss"
      ],
      "happy": [
        "ssssssss",
        "skssssks",
        "ssmmmmss"
      ],
      "angry": [
        "skssssks",
        "sesssses",
        "sssmmsss"
      ]
    },
    "quip": "실례가 안 된다면 가격도 조금만...",
    "react": {
      "success": [
        "감사합니다. 그럼 납기는 이틀만 더 앞당겨 주실 수 있을까요?",
        "훌륭합니다. 다음에도 잘 부탁드립니다. (가격은 따로 말씀드릴게요)",
        "역시 믿고 맡길 수 있네요. 죄송하지만 샘플도 하나만..."
      ],
      "fail": [
        "죄송하지만... 그건 조금 곤란합니다.",
        "음... 본사와 상의해 보겠습니다. (상의 안 함)",
        "실례지만 다른 업체 견적도 받아보겠습니다."
      ]
    }
  },
  {
    "id": "us",
    "code": "US",
    "flag": "🇺🇸",
    "country": "미국",
    "tag": "직진형",
    "rows": [
      "....kkkkkkkk....",
      "..kkhhhhhhhhkk..",
      ".khhhhhhhhhhhhk.",
      ".khHhhhhhhhhhhk.",
      ".kh.ssssssss.hk.",
      ".kh.sesssses.hk.",
      ".kh.ssssssss.hk.",
      "..k.ssssssss.k..",
      "....sssmmsss....",
      "....ssssssss....",
      "...kssssssssk...",
      "....k.ssss.k....",
      "...kjjjttjjjk...",
      "..kjjjjtajjjjk..",
      ".kjjjjjjajjjjjjk",
      "kjjjjjjjjjjjjjjk"
    ],
    "palette": {
      "h": "#d9a74a",
      "H": "#f1c674",
      "j": "#4a5568",
      "a": "#c84c4c"
    },
    "bg": [
      "#3c5fb8",
      "#d9433b"
    ],
    "faces": {
      "normal": [
        "ssssssss",
        "sesssses",
        "sssmmsss"
      ],
      "happy": [
        "ssssssss",
        "sesssses",
        "ssmmmmss"
      ],
      "angry": [
        "skssssks",
        "sesssses",
        "smssssms"
      ]
    },
    "quip": "빠르게 갑시다. 오늘 중으로요.",
    "react": {
      "success": [
        "Great! 바로 사인하죠. 다음 건은 두 배로 갑니다.",
        "완벽해요. 그럼 선적은 오늘 중으로요.",
        "이게 비즈니스죠! 관세는... 아, 됐어요."
      ],
      "fail": [
        "음, 우리 변호사가 연락할 겁니다.",
        "시간 낭비였군요. 다음 미팅은 없습니다.",
        "이러면 곤란하죠. 내일까지 해결하세요."
      ]
    }
  },
  {
    "id": "cn",
    "code": "CN",
    "flag": "🇨🇳",
    "country": "중국",
    "tag": "흥정형",
    "rows": [
      "....kkkkkkkk....",
      "..kkhhhhhhhhkk..",
      ".khhhhhhhhhhhhk.",
      ".khhhhhhhhhhhhk.",
      ".khhsssssssshhk.",
      ".khhsesssseshhk.",
      ".khhsssssssshhk.",
      "..khsssssssshk..",
      "...kssmmssssk...",
      "...kssssssssk...",
      "...kssssssssk...",
      "....k.ssss.k....",
      "...kjjjttjjjkpk.",
      "..kjjjjtjjjjkPk.",
      ".kjjjjjjjjjjkpk.",
      "kjjjjjjjjjjjkkk."
    ],
    "palette": {
      "h": "#15151d",
      "H": "#2f2f3d",
      "j": "#c0392b",
      "p": "#2b2f36",
      "P": "#67e8f9"
    },
    "bg": [
      "#d9433b",
      "#ffd25a"
    ],
    "faces": {
      "normal": [
        "ssssssss",
        "sesssses",
        "ssmmssss"
      ],
      "happy": [
        "ssssssss",
        "sesssses",
        "ssmmmmss"
      ],
      "angry": [
        "skssssks",
        "sesssses",
        "smssssms"
      ]
    },
    "quip": "수량 늘릴게요. 대신 단가 더 낮춰주세요.",
    "react": {
      "success": [
        "좋아요! 수량 두 배로 가죠. 단가는 10%만 더...",
        "친구! 역시 친구! 다음엔 더 싸게 되죠?",
        "오케이 오케이. 계약서는 위챗으로 보낼게요."
      ],
      "fail": [
        "아이고, 그건 아니죠. 다시 계산해 봅시다.",
        "친구끼리 이러면 섭섭하죠...",
        "다른 공장은 더 싸게 해준다던데요?"
      ]
    }
  },
  {
    "id": "de",
    "code": "DE",
    "flag": "🇩🇪",
    "country": "독일",
    "tag": "원칙형",
    "rows": [
      ".....kkkkkkkkk..",
      "...kkhhhhhhhhhk.",
      "..khhhhhhhhhhhhk",
      "..khhhhhhhhhhHhk",
      ".khhsssssssshhk.",
      ".khhgeggggegshk.",
      ".khhsssssssshhk.",
      ".khhsSssssSshhk.",
      "..khsssmmsssk...",
      "...kssssssssk...",
      "...kssssssssk...",
      "....k.ssss.k....",
      "...kjjjttjjjk...",
      "..kjjjjtajjjjk..",
      ".kjjjjjjajjjjjjk",
      "kjjjjjjjjjjjjjjk"
    ],
    "palette": {
      "h": "#5a3a1a",
      "H": "#8a5a2a",
      "j": "#2f5f4f",
      "a": "#c84c4c"
    },
    "bg": [
      "#2a2a35",
      "#ffd25a"
    ],
    "faces": {
      "normal": [
        "ssssssss",
        "geggggeg",
        "sssmmsss"
      ],
      "happy": [
        "ssssssss",
        "geggggeg",
        "ssmmmmss"
      ],
      "angry": [
        "kksssskk",
        "geggggeg",
        "sskkkkss"
      ]
    },
    "quip": "문서 3페이지 2번째 줄을 확인 바랍니다.",
    "react": {
      "success": [
        "정확합니다. 문서 3페이지 2번째 줄 쉼표만 수정 부탁드립니다.",
        "규정대로군요. 좋습니다. 회의는 취소하겠습니다.",
        "만족스럽습니다. 다음 감사는 분기마다 진행합니다."
      ],
      "fail": [
        "규정 위반입니다. 회의를 소집하겠습니다.",
        "이 서류는 받아들일 수 없습니다. 처음부터 다시.",
        "...메모해 두겠습니다. 영구적으로."
      ]
    }
  },
  {
    "id": "vn",
    "code": "VN",
    "flag": "🇻🇳",
    "country": "베트남",
    "tag": "친절형",
    "rows": [
      "....kkkkkkkk....",
      "..kkhhhhhhhhkk..",
      ".khhhhhhhhhhhhk.",
      ".khhhHhhhhhhhhk.",
      ".khhsssssssshhk.",
      ".khhsesssseshhk.",
      ".khhsssssssshhk.",
      ".khhbssssssbhhk.",
      ".khhssmmmmsshhk.",
      ".khhsssssssshhk.",
      ".khksssssssskhk.",
      ".khk.kssssk.khk.",
      ".kh.kjjttjjk.hk.",
      ".khkjjjtajjjjkhk",
      ".kkjjjjjajjjjjkk",
      "kjjjjjjjjjjjjjjk"
    ],
    "palette": {
      "h": "#15151d",
      "H": "#2f2f3d",
      "j": "#5dade2",
      "a": "#ffd25a"
    },
    "bg": [
      "#d9433b",
      "#ffd25a"
    ],
    "faces": {
      "normal": [
        "ssssssss",
        "sesssses",
        "ssmmmmss"
      ],
      "happy": [
        "ssssssss",
        "skssssks",
        "ssmmmmss"
      ],
      "angry": [
        "skssssks",
        "sesssses",
        "sssmmsss"
      ]
    },
    "quip": "괜찮아요, 괜찮아요. 보험은 사장님이 해주실 거죠?",
    "react": {
      "success": [
        "감사해요! 쌀국수 라면 한 박스 보낼게요.",
        "역시 사장님! 다음 선적도 부탁해요.",
        "좋아요 좋아요. 보험 서류는 사진으로 보내주세요."
      ],
      "fail": [
        "어... 그러면 화물은 누가 책임져요?",
        "괜찮아요... 괜찮지 않지만 괜찮아요.",
        "사장님, 하이퐁 세관은 안 괜찮대요."
      ]
    }
  },
  {
    "id": "ae",
    "code": "AE",
    "flag": "🇦🇪",
    "country": "UAE",
    "tag": "느긋형",
    "rows": [
      "....kkkkkkkk....",
      "..kkhhhhhhhhkk..",
      ".khhhhhhhhhhhhk.",
      ".khhhhhhhhhhhhk.",
      ".khhsssssssshhk.",
      ".khhsesssseshhk.",
      ".khhsssssssshhk.",
      ".khhbssssssbhhk.",
      ".khhsssmmssshhk.",
      ".khhsssssssshhk.",
      ".khhhssssss.hhk.",
      ".khhhhssssshhhk.",
      ".khhhhhhhhhhhhk.",
      ".khhhhhhhhhhhhk.",
      ".khjjjjjjjjjjhk.",
      "kjjjjjjjjjjjjjjk"
    ],
    "palette": {
      "h": "#8e44ad",
      "H": "#a569bd",
      "j": "#2a2a35",
      "a": "#ffd25a"
    },
    "bg": [
      "#1f7a4a",
      "#2a2a35"
    ],
    "faces": {
      "normal": [
        "ssssssss",
        "sesssses",
        "sssmmsss"
      ],
      "happy": [
        "ssssssss",
        "sesssses",
        "ssmmmmss"
      ],
      "angry": [
        "skssssks",
        "sesssses",
        "smssssms"
      ]
    },
    "quip": "낙타가 서류를 먹었는데 괜찮겠죠?",
    "react": {
      "success": [
        "완벽해요. 낙타에게도 전해 두겠습니다.",
        "인샬라! 다음 주문은 세 배로 하죠.",
        "훌륭해요. 두바이에 오시면 커피 한 잔 대접할게요."
      ],
      "fail": [
        "음... 낙타가 또 다른 서류를 먹을지도 모르겠네요.",
        "사막에서 기다리는 건 익숙합니다만, 이건 좀.",
        "다음 주에 다시 이야기하죠. 다다음 주일 수도 있고요."
      ]
    }
  },
  {
    "id": "br",
    "code": "BR",
    "flag": "🇧🇷",
    "country": "브라질",
    "tag": "열정형",
    "rows": [
      "...k.kkkkkkk.k..",
      "..khhhhhhhhhhhk.",
      ".khhhhhhhhhhhhhk",
      ".khhhhhhhhhhhhhk",
      ".khhsssssssshhk.",
      ".khhsesssseshhk.",
      ".khhsssssssshhk.",
      ".khhsssssssshhk.",
      "..khsssmmsssk...",
      "..khSSssssSSk...",
      "...kSSSSSSSSk...",
      "....k.ssss.k....",
      "...kjjjttjjjk...",
      "..kjjjjtajjjjk..",
      ".kjjjjjjjjjjjjjk",
      "kjjjjjjjjjjjjjjk"
    ],
    "palette": {
      "h": "#3b2a1a",
      "H": "#5a3f2a",
      "j": "#27ae60",
      "a": "#ffd25a"
    },
    "bg": [
      "#27ae60",
      "#ffd25a"
    ],
    "faces": {
      "normal": [
        "ssssssss",
        "sesssses",
        "ssmmmmss"
      ],
      "happy": [
        "ssssssss",
        "sesssses",
        "smmmmmms"
      ],
      "angry": [
        "skssssks",
        "sesssses",
        "sssmmsss"
      ]
    },
    "quip": "원본은 미리 보내주세요~ 친구잖아요!",
    "react": {
      "success": [
        "오브리가두! 잔금은... 다음 주에 꼭 보낼게요!",
        "최고예요! 삼바 추면서 선적 기다릴게요.",
        "사장님은 진짜 친구예요. 원본은 그래도 미리 보내주시면..."
      ],
      "fail": [
        "아미고... 이러면 리우의 하늘이 슬퍼요.",
        "잔금이요? 아, 그게... 카니발 끝나고요.",
        "믿었는데... 그래도 다음 건은 같이 해요."
      ]
    }
  },
  {
    "id": "fr",
    "code": "FR",
    "flag": "🇫🇷",
    "country": "프랑스",
    "tag": "감성형",
    "rows": [
      "...aaaaaaaaaaa..",
      ".aaaaaaaaaaaaaa.",
      ".kaaaaaaaaaaaak.",
      ".khhhhhhhhhhhhk.",
      ".khhsssssssshhk.",
      ".khhsesssseshhk.",
      ".khhsssssssshhk.",
      ".khhbssssssbhhk.",
      ".khhsssmmssshhk.",
      "..khsssssssshk..",
      "...kssssssssk...",
      "....k.ssss.k....",
      "...kjjjjjjjjk...",
      "..ktttttttttttk.",
      ".kjjjjjjjjjjjjjk",
      "ktttttttttttttt."
    ],
    "palette": {
      "h": "#d9a74a",
      "H": "#f1c674",
      "j": "#1f3a6b",
      "a": "#c0392b"
    },
    "bg": [
      "#3c5fb8",
      "#d9433b"
    ],
    "faces": {
      "normal": [
        "ssssssss",
        "sesssses",
        "sssmmsss"
      ],
      "happy": [
        "ssssssss",
        "sesssses",
        "ssmmmmss"
      ],
      "angry": [
        "skssssks",
        "sesssses",
        "smssssms"
      ]
    },
    "quip": "세관이 컨테이너를 잡았는데, 조명이 참 예쁘죠?",
    "react": {
      "success": [
        "트레 비앙! 조명이 파리의 밤을 밝힐 거예요.",
        "완벽해요. 축하 와인은 제가 쏘죠.",
        "세관도 감동했대요. 아마도요."
      ],
      "fail": [
        "오 라라... 세관이 또 컨테이너를 잡았어요.",
        "이건 예술이 아니라 사고예요.",
        "파리의 가을처럼 쓸쓸한 결과네요."
      ]
    }
  }
];

export const getBuyer = (id) => buyers.find((b) => b.id === id) || buyers[0];

// 픽셀 맵 → SVG 문자열
export function buyerSVG(buyer, expression = 'normal', className = '') {
  const face = buyer.faces[expression] || buyer.faces.normal;
  const rows = buyer.rows.map((row, y) => {
    if (y === 4) return row.slice(0, 4) + face[0] + row.slice(12);
    if (y === 5) return row.slice(0, 4) + face[1] + row.slice(12);
    if (y === 8) return row.slice(0, 4) + face[2] + row.slice(12);
    return row;
  });
  const palette = { ...BUYER_PALETTE, ...buyer.palette };
  let rects = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.') { x += 1; continue; }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w += 1;
      rects += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${palette[ch] || '#f0f'}"/>`;
      x += w;
    }
  });
  return `<svg class="buyer-sprite ${className}" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}
