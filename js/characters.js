// 사장님(플레이어) 캐릭터 4명 : 데이터 + 16×20 픽셀 스프라이트 + 표정
// rows   : 20줄 × 16칸 픽셀 맵 ('.' 은 투명, 나머지 글자는 palette / COMMON_PALETTE 색)
// faces  : 표정별 [눈썹줄(5), 눈줄(6), 입줄(8)] 의 얼굴 6칸(col 5~10) 교체 데이터
// 능력치 : rewardMult(성공 보상 배율) / lossMult(실패 손실 배율) / mentalDmgMult(멘탈 피해 배율)
export const COMMON_PALETTE = {
  "k": "#2a2a35",
  "s": "#f3c6a0",
  "S": "#d9a27a",
  "e": "#1a1a24",
  "w": "#ffffff",
  "m": "#c84c4c",
  "b": "#f5a6a6",
  "t": "#ffffff",
  "l": "#2a3a55",
  "x": "#1a1a1a",
  "g": "#4b6fb8",
  "c": "#6e4a22",
  "y": "#ffd25a"
};

export const characters = [
  {
    "id": "kim",
    "name": "김무역",
    "type": "균형형",
    "tagline": "무역은 기본기가 중요하지.",
    "cash": 100000000,
    "mentalStart": 100,
    "mentalMax": 100,
    "rewardMult": 1.0,
    "lossMult": 1.0,
    "mentalDmgMult": 1.0,
    "abilityText": "별도 보너스 없음. 교과서적인 기본형.",
    "look": "검은 단발머리 · 네이비 정장 · 서류가방",
    "lines": {
      "intro": [
        "새 계약이군. 기본대로 차근차근 가자.",
        "바이어 조건부터 꼼꼼히 읽어보자.",
        "인코텀즈만 정확하면 절반은 끝이야.",
        "서류, 조건, 납기. 순서대로 확인하자."
      ],
      "success": [
        "기본기가 통했네. 다음 건도 이렇게 가자.",
        "서류 완벽, 선적 완료. 교과서대로야.",
        "좋아, 무역왕까지 한 걸음 더."
      ],
      "fail": [
        "기본기를 놓쳤군. 다시 정리하자.",
        "인코텀즈 책을 다시 펼쳐야겠어.",
        "괜찮아, 실수도 데이터야."
      ],
      "crisis": [
        "...오늘은 일찍 퇴근할까.",
        "기본기가 흔들리고 있어. 커피 한 잔만.",
        "무역은 기본기가 중요하지... 멘탈도."
      ]
    },
    "moods": {
      "success": "happy",
      "fail": "sad",
      "crisis": "sad"
    },
    "palette": {
      "h": "#1b1b24",
      "H": "#3a3a4d",
      "j": "#1f3a6b",
      "a": "#c84c4c",
      "p": "#8b5a2b",
      "P": "#5a3a1a"
    },
    "rows": [
      ".....kkkkkk.....",
      "...kkhhhhhhkk...",
      "..khhhhhhhhhhk..",
      "..khHhhhhhhhhk..",
      "..khhhhhhhhhhk..",
      "..khhsssssshhk..",
      "..khhsesseshhk..",
      "..khhbssssbhhk..",
      "..khhssmmsshhk..",
      "...khsssssshk...",
      "...kh.kssk.hk...",
      "....kjjttjjk....",
      "...kjjjtttjjjk..",
      "..kjjjjtatPPjjk.",
      "..kjjjjjakppkjk.",
      "..ksjjjjjkppksk.",
      "...kjjjjjkppkk..",
      "...klllllkkkkk..",
      "....kllk..kllk..",
      "....kxxk..kxxk.."
    ],
    "faces": {
      "normal": [
        "ssssss",
        "sesses",
        "ssmmss"
      ],
      "happy": [
        "ssssss",
        "sesses",
        "smmmms"
      ],
      "sad": [
        "skssks",
        "sesses",
        "smssms"
      ]
    }
  },
  {
    "id": "maeng",
    "name": "맹계약",
    "type": "수익형",
    "tagline": "계약서에 사인만 해주세요♡",
    "cash": 100000000,
    "mentalStart": 100,
    "mentalMax": 100,
    "rewardMult": 1.15,
    "lossMult": 1.1,
    "mentalDmgMult": 1.0,
    "abilityText": "계약 성공 수익 +15%, 실패 손실 +10%.",
    "look": "갈색 긴 머리 · 주황색 재킷 · 계산기",
    "lines": {
      "intro": [
        "오, 돈 냄새가 나는 계약이네요♡",
        "이 바이어, 지갑이 두꺼워 보여요.",
        "계약서 준비됐죠? 사인만 받으면 돼요♡",
        "수익률 계산 끝났어요. 가시죠!"
      ],
      "success": [
        "사인 받았다♡ 수수료는 제 몫이죠?",
        "이 계약, 수익률이 아주 예쁘네요♡",
        "바이어님, 다음 오더도 사인만♡"
      ],
      "fail": [
        "손실이요? 그건 투자 비용이라고 하죠.",
        "계산기가 빨간색을 띄웠어요... 잠깐만요.",
        "이번 건은 할인가로 배운 셈 치죠."
      ],
      "crisis": [
        "계산기가 꺼졌어요. 제 마음도요.",
        "수익이... 수익이 안 보여요...",
        "사인만 해주세요... 제발요..."
      ]
    },
    "moods": {
      "success": "happy",
      "fail": "sad",
      "crisis": "sad"
    },
    "palette": {
      "h": "#7a4a24",
      "H": "#a86c3a",
      "j": "#f0792b",
      "a": "#ffd25a",
      "p": "#aab2bb",
      "P": "#2a2a35"
    },
    "rows": [
      ".....kkkkkk.....",
      "...kkhhhhhhkk...",
      "..khhhhhhhhhhk..",
      "..khHhhhhhhhhk..",
      "..khhhhhhhhhhk..",
      "..khhsssssshhk..",
      "..khhsesseshhk..",
      "..khhbssssbhhk..",
      "..khhssmmsshhk..",
      "..khhsssssshhk..",
      "..khhksssskhhk..",
      "..khhkjttjkhhk..",
      ".khkjjjtttjjjkhk",
      ".khkppkjajjjjkhk",
      "..kkPPkjajjjjjk.",
      "..skPPkjjjjjjsk.",
      "...kkkkjjjjjjk..",
      "...klllllllllk..",
      "....kllk..kllk..",
      "....kxxk..kxxk.."
    ],
    "faces": {
      "normal": [
        "ssssss",
        "sesses",
        "ssmmss"
      ],
      "happy": [
        "ssssss",
        "sesses",
        "smmmms"
      ],
      "sad": [
        "skssks",
        "sesses",
        "smssms"
      ]
    }
  },
  {
    "id": "yang",
    "name": "양멘탈",
    "type": "멘탈형",
    "tagline": "괜찮아. 통관은 언젠간 되겠지.",
    "cash": 100000000,
    "mentalStart": 120,
    "mentalMax": 120,
    "rewardMult": 1.0,
    "lossMult": 1.0,
    "mentalDmgMult": 0.8,
    "abilityText": "최대 멘탈 120. 오답 시 멘탈 감소 20% 완화.",
    "look": "밝은 갈색 머리 · 초록색 재킷 · 커피잔",
    "lines": {
      "intro": [
        "괜찮아, 이번 건도 어떻게든 되겠지.",
        "커피 한 잔 하고 천천히 보자.",
        "바이어가 급해도 우리는 침착하게.",
        "통관은 언젠간 돼. 일단 읽어보자."
      ],
      "success": [
        "거봐, 통관 됐잖아. 커피 한 잔 더!",
        "괜찮아, 잘 될 줄 알았어.",
        "세관도 커피를 마셨나 봐. 술술 풀리네."
      ],
      "fail": [
        "괜찮아. 다음 배는 분명 뜰 거야.",
        "이런 날도 있지. 커피나 내리자.",
        "통관은 언젠간 되겠지. 아마도."
      ],
      "crisis": [
        "괜찮아... 괜찮아... 안 괜찮아.",
        "커피가 떨어졌어. 멘탈도.",
        "언젠간 되겠지... 언젠간..."
      ]
    },
    "moods": {
      "success": "happy",
      "fail": "sad",
      "crisis": "sad"
    },
    "palette": {
      "h": "#b07a45",
      "H": "#d9a06a",
      "j": "#3bb273",
      "a": "#1f7a4a",
      "p": "#ffffff",
      "P": "#d9d2bd"
    },
    "rows": [
      ".....kkkkkk.....",
      "...kkhhhhhhkk...",
      "..khhhhhhhhhhk..",
      "..khHhhhhhhhhkhk",
      "..khhhhhhhhhhkhk",
      "..khhsssssshhkhk",
      "..khhsesseshhkhk",
      "..khhbssssbhhkhk",
      "..khhssmmsshhkhk",
      "...khsssssshkhk.",
      "...kh.kssk.hkk..",
      "....kjjttjjk....",
      "...kjjjtttjjjk..",
      "..kjjjjtatjjjjk.",
      "..kjjjjjajjkcck.",
      "..ksjjjjjjjkppks",
      "...kjjjjjjjkppk.",
      "...klllllllllk..",
      "....kllk..kllk..",
      "....kxxk..kxxk.."
    ],
    "faces": {
      "normal": [
        "ssssss",
        "sesses",
        "ssmmss"
      ],
      "happy": [
        "ssssss",
        "sesses",
        "smmmms"
      ],
      "sad": [
        "skssks",
        "sesses",
        "smssms"
      ]
    }
  },
  {
    "id": "hong",
    "name": "홍불안",
    "type": "불안형",
    "tagline": "잠깐만... 이거 진짜 선적된 거 맞아?",
    "cash": 100000000,
    "mentalStart": 70,
    "mentalMax": 100,
    "rewardMult": 1.25,
    "lossMult": 1.0,
    "mentalDmgMult": 2.0,
    "abilityText": "계약 성공 수익 +25%. 시작 멘탈 70, 오답 시 멘탈 피해 2배.",
    "look": "헝클어진 검은 머리 · 안경 · 구겨진 서류",
    "lines": {
      "intro": [
        "이 바이어... 뭔가 수상한데요?",
        "잠깐만요, 조건 다시 읽어볼게요. 또 읽어볼게요.",
        "이거 잘못 답하면 세관에서 전화 오겠죠...?",
        "선적 전인데 벌써 불안해요..."
      ],
      "success": [
        "근데 입금은 진짜 되는 거죠?",
        "성공이래요... 함정 아니죠?",
        "서류에 오타 없었는지 다시 볼게요."
      ],
      "fail": [
        "제가 이럴 줄 알았어요...",
        "역시... 선적된 게 아니었어...",
        "세관 전화 오면 저 없다고 해주세요."
      ],
      "crisis": [
        "저 그냥 퇴사하면 안 될까요?",
        "메신저 알림이 무서워요...",
        "바다를 보면 마음이 편해져요... 아니네요."
      ]
    },
    "moods": {
      "success": "happy",
      "fail": "sad",
      "crisis": "sad"
    },
    "palette": {
      "h": "#15151d",
      "H": "#2f2f3d",
      "j": "#6b5b95",
      "a": "#c84c4c",
      "p": "#ffffff",
      "P": "#9aa5b1"
    },
    "rows": [
      "...k.kkkkk.k....",
      "..kkhhhhhhhkhk..",
      ".khhhhhhhhhhhhk.",
      "..khhhHhhhhhhk..",
      "..khhhhhhhhhhk..",
      "..khhsssssshhk..",
      "..khhgeggeghhk..",
      "..khhsSssSshhk..",
      "..khhssmssshhk..",
      "...khsssssshk...",
      "...kh.kssk.hk...",
      "....kjjttjjk....",
      "...kjjjtttjjjk..",
      ".kppkjjtatjjjjk.",
      ".kpPpkjjajjjjjk.",
      ".kppPkjjjjjjjsk.",
      "..kkkkjjjjjjjk..",
      "...klllllllllk..",
      "....kllk..kllk..",
      "....kxxk..kxxk.."
    ],
    "faces": {
      "normal": [
        "ssssss",
        "geggeg",
        "ssmsss"
      ],
      "happy": [
        "kssssk",
        "geggeg",
        "ssmmss"
      ],
      "sad": [
        "skssks",
        "geggeg",
        "smssms"
      ]
    }
  }
];

export const getCharacter = (id) => characters.find((c) => c.id === id) || characters[0];

// 픽셀 맵 → SVG 문자열 (같은 줄의 연속된 같은 색은 하나의 rect 로 합침)
export function spriteSVG(character, expression = 'normal', className = '') {
  const face = character.faces[expression] || character.faces.normal;
  const rows = character.rows.map((row, y) => {
    if (y === 5) return row.slice(0, 5) + face[0] + row.slice(11);
    if (y === 6) return row.slice(0, 5) + face[1] + row.slice(11);
    if (y === 8) return row.slice(0, 5) + face[2] + row.slice(11);
    return row;
  });
  const palette = { ...COMMON_PALETTE, ...character.palette };
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
  return `<svg class="sprite ${className}" viewBox="0 0 16 20" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}
