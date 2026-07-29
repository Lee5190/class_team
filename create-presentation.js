const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'OpenCode';
pptx.subject = '가중치 이분 그래프 기반 성적 맞춤형 조 배정 앱';
pptx.title = '가중치 이분 그래프로 공정한 조를 설계하다';
pptx.company = 'Discrete Mathematics Project';
pptx.lang = 'ko-KR';
pptx.theme = {
  headFontFace: 'Malgun Gothic', bodyFontFace: 'Malgun Gothic', lang: 'ko-KR'
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';

const C = { ink:'FFFFFF', muted:'D2DDEA', paper:'111B2A', mint:'4E857F', cyan:'9AF2E4', coral:'FF8E79', sun:'FFD66D', blue:'9ABEFF', line:'58728E', white:'1E3045', navy:'07111D', pale:'29445A' };
const W = 13.333, H = 7.5;
const slide = () => { const s = pptx.addSlide(); s.background = { color:C.paper }; return s; };
const tx = (s, text, x, y, w, h, opt={}) => {
  const isMono = opt.fontFace === 'Aptos Mono';
  const requested = opt.fontSize || 12;
  // Keep explanatory Korean text legible when slides are projected.
  const fontSize = isMono ? Math.max(requested, 8.5) : Math.max(requested, 11.5);
  const legacyTextColors = { '0C7168':C.cyan, '9B5726':C.sun, 'A44333':C.coral, '2865C7':C.blue, '12334B':C.ink, '456174':C.muted, '579389':C.cyan };
  const color = legacyTextColors[opt.color] || opt.color || C.ink;
  return s.addText(text, { x,y,w,h, margin:0, breakLine:false, fontFace:'Malgun Gothic', color, fit:'shrink', valign:'mid', ...opt, color, fontSize });
};
const line = (s, x1,y1,x2,y2,color=C.line,width=1) => s.addShape(pptx.ShapeType.line,{x:x1,y:y1,w:x2-x1,h:y2-y1,line:{color,width}});
const rect = (s,x,y,w,h,fill, radius=0, lineColor=fill) => {
  // Legacy light cards are remapped to dark surfaces so their white text stays readable.
  const darkSurfaces = { 'FFFFFF':C.white, 'DFF0FF':'254A64', 'E1F5EE':'284E4D', 'EAF7F2':'244C4D', 'FFF0D9':'5A4428', 'FFE3DD':'623B3A', 'F4F7F6':'15263A', 'FDFDFC':C.white };
  const resolvedFill = darkSurfaces[fill] || fill;
  const resolvedLine = darkSurfaces[lineColor] || lineColor;
  return s.addShape(radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect,{x,y,w,h,rectRadius:radius,fill:{color:resolvedFill},line:{color:resolvedLine,transparency:radius?100:0}});
};
const header = (s,n,label) => { tx(s,`${String(n).padStart(2,'0')}  /  ${label.toUpperCase()}`,0.62,0.31,4.5,0.28,{fontFace:'Aptos Mono',fontSize:9.5,color:C.cyan,charSpacing:1.2,bold:true}); tx(s,'DATA LAB / 2026',10.48,0.31,2.2,0.28,{fontFace:'Aptos Mono',fontSize:8.5,color:C.muted,align:'right',charSpacing:.8}); line(s,.62,.72,12.7,.72,C.line,1); };
const footer = (s, page) => { line(s,.62,7.02,12.7,7.02,C.line,1); tx(s,'BALANCE / MATCH / LEARN',.62,7.15,3,.19,{fontFace:'Aptos Mono',fontSize:8,color:C.cyan,charSpacing:1}); tx(s,String(page).padStart(2,'0'),12.15,7.15,.55,.19,{fontFace:'Aptos Mono',fontSize:8.5,color:C.muted,align:'right'}); };
const pill = (s,text,x,y,w,color=C.pale,textColor=C.cyan) => { rect(s,x,y,w,.36,color,.18); tx(s,text,x,y+.02,w,.3,{fontFace:'Aptos Mono',fontSize:8,bold:true,color:textColor,align:'center',charSpacing:.35}); };
const bullet = (s,text,x,y,w,accent=C.cyan) => { s.addShape(pptx.ShapeType.ellipse,{x,y:y+.08,w:.08,h:.08,fill:{color:accent},line:{color:accent}}); tx(s,text,x+.18,y,w-.18,.35,{fontSize:12,color:C.ink,breakLine:true,fit:'shrink'}); };
const decorate = (s, index) => {
  // A restrained grid and oversized index give the deck a data-lab identity.
  for (let x=.62; x<12.7; x+=.34) line(s,x,.86,x,.9,'385069',.45);
  s.addShape(pptx.ShapeType.arc,{x:11.25,y:5.52,w:2.25,h:2.25,adjustPoint:.16,line:{color:C.mint,width:5,transparency:40},adjustPoint2:.25});
  tx(s,String(index).padStart(2,'0'),10.95,6.02,1.18,.62,{fontFace:'Aptos Mono',fontSize:32,bold:true,color:'385069',align:'right'});
};

// 1. Cover
{ const s=slide();
  s.addShape(pptx.ShapeType.arc,{x:9.6,y:-2,w:5.6,h:5.6,adjustPoint:.25,line:{color:C.mint,width:15,transparency:22},adjustPoint2:.3});
  tx(s,'2026 / DISCRETE MATHEMATICS PROJECT',.7,.55,5,.22,{fontFace:'Aptos Mono',fontSize:8,color:C.cyan,charSpacing:1.1,bold:true}); pill(s,'RESEARCH PRESENTATION',10.25,.49,2.32,C.pale,C.cyan);
  tx(s,'가중치 이분 그래프로',.7,1.55,8.5,.7,{fontSize:31,bold:true,charSpacing:-1.7});
  tx(s,'공정한 조를 설계하다',.7,2.27,8.5,.78,{fontSize:34,bold:true,color:C.blue,charSpacing:-2});
  tx(s,'학생 성적 데이터를 기반으로 조별 평균이 균등해지도록\n최대 가중치 매칭으로 최적의 팀 조합을 찾는 앱 개발',.73,3.25,5.8,.67,{fontSize:14,color:C.muted,breakLine:true,fit:'shrink',breakLine:false});
  pill(s,'WEIGHTED BIPARTITE GRAPH',.7,4.34,2.55,C.pale,C.cyan); pill(s,'MAXIMUM WEIGHT MATCHING',3.38,4.34,2.9,'493627',C.sun);
  const left=[[10.15,1.55,'98'],[10.15,2.7,'82'],[10.15,3.85,'69']], right=[[11.92,2.08,'42'],[11.92,3.22,'58'],[11.92,4.35,'71']];
  [[10.45,1.8,12.18,2.3,C.coral],[10.45,2.95,12.18,3.45,C.coral],[10.45,4.1,12.18,4.58,C.coral],[10.45,1.8,12.18,3.45,'8BBFB4'],[10.45,2.95,12.18,2.3,'8BBFB4']].forEach(a=>line(s,a[0],a[1],a[2],a[3],a[4],a[4]===C.coral?2.5:1));
  left.forEach(a=>{s.addShape(pptx.ShapeType.ellipse,{x:a[0],y:a[1],w:.6,h:.6,fill:{color:C.blue},line:{color:C.blue}});tx(s,a[2],a[0],a[1]+.16,.6,.18,{fontFace:'Aptos Mono',fontSize:9,bold:true,color:C.white,align:'center'});});
  right.forEach(a=>{rect(s,a[0],a[1],.6,.6,C.coral,.12);tx(s,a[2],a[0],a[1]+.16,.6,.18,{fontFace:'Aptos Mono',fontSize:9,bold:true,color:C.white,align:'center'});});
  line(s,.7,6.55,12.63,6.55,C.line,.8);tx(s,'수학/정보 융합 탐구  |  성적 맞춤형 조 배정 앱',.7,6.72,6,.2,{fontSize:9,color:C.muted});tx(s,'01',12.12,6.72,.5,.2,{fontFace:'Aptos Mono',fontSize:9,color:C.muted,align:'right'});
}

// 2. Presentation roadmap
{ const s=slide(); decorate(s,2); header(s,2,'Roadmap'); tx(s,'발표 흐름',.62,1.05,8.5,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  tx(s,'문제의식에서 수학적 모델링, 앱 구현과 검증까지의 탐구 과정을 순서대로 소개합니다.',.62,1.71,9.2,.3,{fontSize:12,color:C.muted});
  const items=[['01','문제 상황','조 편성에서 생기는 학습 효율·공정성 문제'],['02','연구 목표','성적 균형을 자동으로 만드는 앱 설계'],['03','수학적 모델','가중치 이분 그래프와 최대 가중치 매칭'],['04','구현·검증','AI 프롬프트, 디버깅, 테스트 결과'],['05','의의·확장','이산수학 활용과 향후 발전 방향']];
  items.forEach((a,i)=>{const y=2.18+i*.78;rect(s,.62,y,12.06,.59,i===2?'DFF0FF':'FFFFFF',.1,C.line);tx(s,a[0],.92,y+.17,.48,.16,{fontFace:'Aptos Mono',fontSize:8,bold:true,color:i===2?C.blue:'0C8476'});tx(s,a[1],1.68,y+.13,1.62,.21,{fontSize:12,bold:true});tx(s,a[2],3.45,y+.16,8.3,.18,{fontSize:10.5,color:C.muted});});
  rect(s,.62,6.32,12.06,.47,C.navy,.1);tx(s,'KEY QUESTION  /  수학적 최적화로 모든 조의 성적 균형을 만들 수 있을까?',.91,6.46,11.5,.15,{fontFace:'Aptos Mono',fontSize:9,bold:true,color:'DFF4F2',align:'center',charSpacing:.4}); footer(s,2); }

// 3. Problem
{ const s=slide(); decorate(s,3); header(s,3,'Problem'); tx(s,'왜 “공정한 조 배정”이 필요한가?',.62,1.05,8.5,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  const cards=[['문제 상황','상위권 또는 하위권 학생이 특정 조에 몰리면 조별 학습 효율과 공정성에 문제가 생깁니다.',C.coral],['기존 방식','등수 순서대로 단순히 짝짓는 방식은 과목 편차나 3인 이상 조 확장에 취약합니다.',C.sun],['연구 목표','각 조의 성적 합산 또는 평균이 균등해지도록 자동으로 조를 구성합니다.',C.cyan]];
  cards.forEach((c,i)=>{const x=.62+i*4.1;rect(s,x,2.02,3.72,2.32,C.white,.12,C.line);rect(s,x+.23,2.27,.13,.62,c[2]);tx(s,`0${i+1}`,x+.52,2.26,.5,.2,{fontFace:'Aptos Mono',fontSize:8,color:C.muted});tx(s,c[0],x+.52,2.58,2.75,.3,{fontSize:15,bold:true});tx(s,c[1],x+.25,3.15,3.18,.7,{fontSize:11.5,color:C.muted,breakLine:true,fit:'shrink'});});
  rect(s,.62,5.0,12.06,1.25,'E1F5EE',.12);tx(s,'핵심 질문',.92,5.27,1.2,.22,{fontSize:12,bold:true,color:'0C7168'});tx(s,'“학생들의 성적 균형을 수학적으로 측정하고, 가장 공정한 조합을 자동으로 찾을 수 있을까?”',2.2,5.18,9.6,.42,{fontSize:17,bold:true,charSpacing:-.8}); footer(s,3); }

// 4. Goal and scope
{ const s=slide(); decorate(s,4); header(s,4,'Research Goal'); tx(s,'연구 목표와 설계 범위',.62,1.05,8.5,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  rect(s,.62,1.95,5.5,3.65,'E1F5EE',.14);tx(s,'연구 목표',.95,2.28,1.4,.25,{fontSize:16,bold:true,color:'0C7168'});tx(s,'학생들의 성적 데이터를 기반으로\n각 조의 성적 합산 또는 평균이\n균등해지도록 자동으로 짝을 지어 주는\n성적 맞춤형 조 배정 앱을 개발한다.',.95,2.92,4.7,1.5,{fontSize:18,bold:true,breakLine:true,fit:'shrink'});pill(s,'STREAMLIT + PYTHON',.95,4.83,1.78,'2865C7',C.white);
  const scope=[['입력','학생 이름, 수학/정보 성적 점수'],['처리','성적순 정렬, 균형 점수 계산, 최적 매칭'],['출력','이분 그래프 시각화와 조별 평균 결과표']];scope.forEach((a,i)=>{const y=2.03+i*1.15;rect(s,6.7,y,5.98,.88,C.white,.11,C.line);tx(s,a[0],6.98,y+.21,.75,.19,{fontSize:11,bold:true,color:C.blue});tx(s,a[1],7.92,y+.18,4.3,.25,{fontSize:12,color:C.ink});});
  tx(s,'설계 원칙',.7,6.2,1.1,.18,{fontFace:'Aptos Mono',fontSize:8,bold:true,color:'0C8476',charSpacing:.7});tx(s,'모든 학생의 중복 없는 배정 · 조 평균 편차 최소화 · 결과의 시각적 설명 가능성',.7,6.47,11.4,.23,{fontSize:13,bold:true});footer(s,4); }

// 5. Model
{ const s=slide(); decorate(s,5); header(s,5,'Mathematical Model'); tx(s,'가중치 이분 그래프로 관계를 모델링',.62,1.05,8.8,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  tx(s,'두 집합의 학생을 나누고, 가능한 조합마다 “성적 균형 점수”를 간선의 가중치로 부여합니다.',.62,1.71,9.8,.3,{fontSize:12,color:C.muted});
  rect(s,.62,2.25,7.2,3.98,C.white,.12,C.line); tx(s,'WEIGHTED BIPARTITE GRAPH',.94,2.55,3,.18,{fontFace:'Aptos Mono',fontSize:8,color:'0C8476',bold:true,charSpacing:.8});
  const A=[['A1',98],['A2',91],['A3',84]],B=[['B1',42],['B2',51],['B3',63]]; const ay=[3.18,4.08,4.98], by=[3.45,4.35,5.25];
  [[1.72,3.48,5.95,3.75,'8BBFB4'],[1.72,3.48,5.95,4.65,C.coral],[1.72,4.38,5.95,4.65,'8BBFB4'],[1.72,4.38,5.95,5.55,C.coral],[1.72,5.28,5.95,4.65,'8BBFB4'],[1.72,5.28,5.95,5.55,C.coral]].forEach(a=>line(s,a[0],a[1],a[2],a[3],a[4],a[4]===C.coral?2.3:1.1));
  A.forEach((a,i)=>{s.addShape(pptx.ShapeType.ellipse,{x:1.35,y:ay[i],w:.74,h:.55,fill:{color:C.blue},line:{color:C.blue}});tx(s,`${a[0]}\n${a[1]}`,1.35,ay[i]+.07,.74,.34,{fontFace:'Aptos Mono',fontSize:7,bold:true,color:C.white,align:'center',breakLine:true});});
  B.forEach((a,i)=>{rect(s,5.65,by[i],.74,.55,C.coral,.1);tx(s,`${a[0]}\n${a[1]}`,5.65,by[i]+.07,.74,.34,{fontFace:'Aptos Mono',fontSize:7,bold:true,color:C.white,align:'center',breakLine:true});});
  tx(s,'상위권 그룹 A',.95,5.87,1.5,.18,{fontSize:8,color:C.muted,align:'center'});tx(s,'하위권 그룹 B',5.15,5.87,1.75,.18,{fontSize:8,color:C.muted,align:'center'});
  const notes=[['정점 Vertex','학생 그룹 A(상위권)와 B(하위권)'],['간선 Edge','같은 조가 될 수 있는 학생 조합'],['가중치 Weight','조 평균이 목표 평균에 가까울수록 높은 점수']];notes.forEach((n,i)=>{const y=2.38+i*1.15;rect(s,8.3,y,4.38,.9,i===2?'FFF0D9':'EAF7F2',.1);tx(s,n[0],8.57,y+.19,1.15,.18,{fontSize:10,bold:true,color:i===2?'9B5726':'0C7168'});tx(s,n[1],9.8,y+.17,2.58,.35,{fontSize:10.5,color:C.ink,breakLine:true,fit:'shrink'});}); footer(s,5); }

// 6. Weight calculation
{ const s=slide(); decorate(s,6); header(s,6,'Weight Design'); tx(s,'“균형”을 가중치로 바꾸는 방법',.62,1.05,9.5,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  tx(s,'두 학생이 한 조가 되었을 때의 평균이 전체 목표 평균에 가까울수록 더 높은 가중치를 부여합니다.',.62,1.71,10.2,.3,{fontSize:12,color:C.muted});
  rect(s,.62,2.23,6.2,3.55,C.white,.13,C.line);tx(s,'WEIGHT FUNCTION',.94,2.55,2,.18,{fontFace:'Aptos Mono',fontSize:8,bold:true,color:'0C8476',charSpacing:.8});tx(s,'group_avg = (학생 A 점수 + 학생 B 점수) / 2',.94,3.08,5.3,.3,{fontFace:'Aptos Mono',fontSize:12,bold:true,color:C.navy,fit:'shrink'});tx(s,'weight = 100 - |목표 평균 - 조 평균|',.94,3.72,4.9,.3,{fontFace:'Aptos Mono',fontSize:14,bold:true,color:C.coral,fit:'shrink'});tx(s,'거리(편차)가 작아질수록 weight 값은 커집니다.',.94,4.48,4.7,.22,{fontSize:11,color:C.muted});
  const examples=[['조합 A','98점 + 42점','조 평균 70점','목표와 동일 → 높은 가중치'],['조합 B','98점 + 63점','조 평균 80.5점','목표와 멀다 → 낮은 가중치']];examples.forEach((a,i)=>{const y=2.35+i*1.7;rect(s,7.3,y,5.38,1.35,i===0?'E1F5EE':'FFF0D9',.12);tx(s,a[0],7.6,y+.21,.85,.18,{fontSize:11,bold:true,color:i===0?'0C7168':'9B5726'});tx(s,a[1],8.65,y+.18,1.4,.2,{fontSize:12,bold:true});tx(s,a[2],10.2,y+.18,1.5,.2,{fontSize:12,bold:true});tx(s,a[3],7.6,y+.79,4.4,.2,{fontSize:10.5,color:C.muted});});footer(s,6); }

// 7. Matching
{ const s=slide(); decorate(s,7); header(s,7,'Optimization'); tx(s,'최대 가중치 매칭: 가장 균형 잡힌 조합',.62,1.05,10,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  tx(s,'모든 학생은 한 번씩만 연결되고, 선택된 간선의 가중치 합은 최대가 됩니다.',.62,1.71,9.5,.3,{fontSize:12,color:C.muted});
  const steps=[['1','성적 입력','이름과 수학/정보 점수 입력'],['2','성적 정렬','상위권과 하위권 그룹 분리'],['3','가중치 계산','목표 평균과의 거리로 점수화'],['4','최적 매칭','가중치 합이 최대인 조합 선택']];
  steps.forEach((a,i)=>{const x=.62+i*3.05;rect(s,x,2.45,2.67,2.1,C.white,.12,C.line);s.addShape(pptx.ShapeType.ellipse,{x:x+.22,y:2.69,w:.43,h:.43,fill:{color:i===3?C.coral:C.blue},line:{color:i===3?C.coral:C.blue}});tx(s,a[0],x+.22,2.81,.43,.12,{fontFace:'Aptos Mono',fontSize:7,bold:true,color:C.white,align:'center'});tx(s,a[1],x+.24,3.34,2.1,.25,{fontSize:15,bold:true});tx(s,a[2],x+.24,3.78,2.08,.38,{fontSize:10,color:C.muted,breakLine:true,fit:'shrink'});if(i<3)tx(s,'→',x+2.69,3.27,.35,.22,{fontFace:'Aptos Mono',fontSize:15,color:'579389',align:'center'});});
  rect(s,.62,5.25,12.06,1.05,'DFF0FF',.12);tx(s,'결과',.93,5.61,.72,.2,{fontSize:13,bold:true,color:C.blue});tx(s,'각 조의 성적 평균 편차가 최소가 되는 1:1 조 배정',1.8,5.53,7.4,.32,{fontSize:18,bold:true,charSpacing:-.7});pill(s,'TOTAL WEIGHT = MAXIMUM',9.64,5.59,2.38,'2865C7',C.white);footer(s,7); }

// 8. App workflow
{ const s=slide(); decorate(s,8); header(s,8,'App Workflow'); tx(s,'앱의 실행 흐름과 화면 구성',.62,1.05,9.6,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  tx(s,'사용자는 성적을 입력하고, 앱은 그래프와 결과표를 통해 조 배정 근거를 함께 보여줍니다.',.62,1.71,10,.3,{fontSize:12,color:C.muted});
  const panels=[['입력 화면','학생 이름과 수학/정보 성적 입력','학생 A  98점\n학생 B  42점\n학생 C  91점\n학생 D  51점'],['그래프 화면','가중치가 있는 학생 조합 시각화','98  ━━━  42\n91  ━━━  51\n84  ━━━  63'],['결과 화면','조별 평균과 배정 결과 확인','1조  98 + 42 = 70\n2조  91 + 51 = 71\n3조  84 + 63 = 73']];
  panels.forEach((a,i)=>{const x=.62+i*4.1;rect(s,x,2.33,3.72,3.56,C.white,.14,C.line);rect(s,x+.25,2.61,3.22,.38,i===0?'DFF0FF':i===1?'E1F5EE':'FFF0D9',.07);tx(s,`0${i+1}  ${a[0]}`,x+.38,2.72,2.45,.15,{fontFace:'Aptos Mono',fontSize:8,bold:true,color:i===2?'9B5726':i===1?'0C7168':C.blue});tx(s,a[1],x+.28,3.28,3.1,.3,{fontSize:13,bold:true});rect(s,x+.28,3.83,3.1,1.35,'F4F7F6',.06);tx(s,a[2],x+.55,4.15,2.55,.75,{fontFace:'Aptos Mono',fontSize:10,color:C.navy,breakLine:true,fit:'shrink'});if(i<2)tx(s,'→',x+3.68,3.98,.35,.22,{fontFace:'Aptos Mono',fontSize:15,color:'579389',align:'center'});});
  tx(s,'입력 → 최적화 → 시각화의 과정을 한 화면 흐름으로 제공하여 결과를 쉽게 설명할 수 있도록 구성했습니다.',.62,6.37,11.5,.23,{fontSize:12,bold:true,color:'0C7168',align:'center'});footer(s,8); }

// 9. Prompt and debugging
{ const s=slide(); decorate(s,9); header(s,9,'Vibe Coding'); tx(s,'AI와의 대화로 알고리즘을 개선하다',.62,1.05,9.6,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  const items=[['1차 지시','학생 8명의 성적을 입력받아 2명씩 4개 조로 묶는 기본 화면과 알고리즘을 만들어줘.','DFF0FF'],['발견한 오류','AI가 “1등-8등, 2등-7등” 식의 단순 순서 매칭을 수행. 과목 편차와 다인 조 확장에서 점수 편향 발생.','FFE3DD'],['2차 지시','조 평균과 전체 평균의 편차를 손실 가중치로 계산하고, 그 합이 최소가 되도록 매칭 로직을 수정해줘.','E1F5EE']];
  items.forEach((a,i)=>{const y=1.98+i*1.37;rect(s,.62,y,12.06,1.05,a[2],.12);tx(s,a[0],.93,y+.2,1.42,.2,{fontFace:'Aptos Mono',fontSize:10,bold:true,color:i===1?'A44333':'0C7168'});tx(s,a[1],2.35,y+.16,9.75,.48,{fontSize:12.3,color:C.ink,breakLine:true,fit:'shrink'});});
  rect(s,.62,6.2,12.06,.54,C.navy,.1);tx(s,'핵심 디버깅: 수학적 목적함수와 제약조건을 프롬프트에 명확히 표현해야 AI가 올바른 알고리즘을 구현한다.',.92,6.34,11.5,.17,{fontSize:10.2,bold:true,color:'DFF4F2',align:'center'});footer(s,9); }

// 10. Code
{ const s=slide(); decorate(s,10); header(s,10,'Core Logic'); tx(s,'성적 균형 가중치 계산 로직',.62,1.05,8.5,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  rect(s,.62,1.93,6.4,4.58,C.navy,.14);tx(s,'PYTHON / WEIGHT FUNCTION',.92,2.25,3,.18,{fontFace:'Aptos Mono',fontSize:8,bold:true,color:'7FE1CF',charSpacing:.9});
  const code=`def calculate_edge_weight(student_a_score,
                          student_b_score, target_avg):
    group_avg = (student_a_score + student_b_score) / 2

    # 목표 평균과 가까울수록 우선순위를 높인다.
    weight = 100 - abs(target_avg - group_avg)
    return weight

# 이분 그래프에서 가중치 합이 가장 높은 짝을 매칭`;
  tx(s,code,.92,2.75,5.75,2.95,{fontFace:'Aptos Mono',fontSize:10.5,color:'DFF4F2',breakLine:true,fit:'shrink',breakLine:false,paraSpaceAfterPt:0});
  const facts=[['입력','두 학생의 점수와 목표 평균'],['계산','조 평균과 목표 평균의 거리'],['출력','균형이 좋을수록 높은 가중치']];facts.forEach((a,i)=>{const y=2.08+i*1.23;rect(s,7.55,y,5.13,.94,i===1?'FFF0D9':'EAF7F2',.11);tx(s,a[0],7.86,y+.21,.8,.2,{fontSize:11,bold:true,color:i===1?'9B5726':'0C7168'});tx(s,a[1],8.93,y+.2,3.35,.23,{fontSize:12,color:C.ink});});
  pill(s,'WEIGHT = 100 - |TARGET AVG - GROUP AVG|',7.55,5.92,4.4,'2865C7',C.white);footer(s,10); }

// 11. Results
{ const s=slide(); decorate(s,11); header(s,11,'Results'); tx(s,'테스트 결과: 조별 평균 오차 2.5점 이내',.62,1.05,10.5,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  tx(s,'성적 40점~100점 사이의 학생 12명을 대상으로 조 편성 결과를 확인했습니다.',.62,1.71,8.7,.3,{fontSize:12,color:C.muted});
  const scores=[72,71,70,69,73,70,71,72,69,70,72,71];const labels=['1조','2조','3조','4조'];rect(s,.62,2.3,8.0,3.72,C.white,.12,C.line);tx(s,'GROUP AVERAGE SCORE',.92,2.58,2.5,.18,{fontFace:'Aptos Mono',fontSize:8,bold:true,color:'0C8476',charSpacing:.7}); line(s,1.25,5.42,7.95,5.42,'9CBAB3',1);line(s,1.25,3.22,1.25,5.42,'9CBAB3',1);
  [70,72,74].forEach(v=>{const y=5.42-(v-68)*.48;line(s,1.25,y,7.95,y,'DCE8E5',.6);tx(s,String(v),.82,y-.09,.3,.16,{fontSize:7,color:C.muted,align:'right'});});scores.forEach((v,i)=>{const x=1.6+i*.5; const h=(v-68)*.48;rect(s,x,5.42-h,.3,h,i%3===0?C.coral:C.cyan,.04);});labels.forEach((v,i)=>tx(s,v,1.5+i*1.5,5.58,.8,.17,{fontSize:8,color:C.muted,align:'center'}));
  const res=[['12명','테스트 학생 수'],['40~100점','성적 분포'],['≤ 2.5점','조 평균 오차 범위']];res.forEach((a,i)=>{const x=9.1;const y=2.35+i*1.1;rect(s,x,y,3.58,.84,i===2?'E1F5EE':'FDFDFC',.1,C.line);tx(s,a[0],x+.25,y+.16,1.3,.25,{fontSize:18,bold:true,color:i===2?'0C7168':C.blue});tx(s,a[1],x+1.65,y+.23,1.55,.18,{fontSize:9.5,color:C.muted});});
  rect(s,.62,6.36,12.06,.48,'DFF0FF',.1);tx(s,'성적 균형이라는 목적함수를 명확히 적용하자, 모든 조가 거의 동일한 평균 점수로 배정되었습니다.',.91,6.5,11.5,.17,{fontSize:10.4,bold:true,color:'0C7168',align:'center'});footer(s,11); }

// 12. Limitations
{ const s=slide(); decorate(s,12); header(s,12,'Limitations'); tx(s,'한계점과 향후 발전 방향',.62,1.05,9.8,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  const rows=[['현재 한계','단일 과목 성적만 고려','학생의 다양한 학습 역량을 모두 반영하지 못함',C.coral],['현재 한계','친밀도·선호도 미반영','수학적으로 균형이어도 협업 만족도가 낮을 수 있음',C.coral],['향후 확장','다중 가중치 매칭','성적 + 선호도 + 친밀도를 함께 최적화',C.cyan]];rows.forEach((a,i)=>{const y=2.0+i*1.18;rect(s,.62,y,12.06,.91,i===2?'E1F5EE':'FFFFFF',.12,C.line);rect(s,.88,y+.2,.1,.5,a[3]);tx(s,a[0],1.22,y+.2,1.02,.18,{fontSize:10,bold:true,color:a[3]===C.coral?'A44333':'0C7168'});tx(s,a[1],2.52,y+.17,2.45,.23,{fontSize:14,bold:true});tx(s,a[2],5.25,y+.19,6.5,.22,{fontSize:11.5,color:C.muted});});
  rect(s,.62,5.98,12.06,.67,'DFF0FF',.12);tx(s,'Multi-objective Bipartite Matching  =  여러 기준을 동시에 고려하는 더 현실적인 조 배정',.92,6.23,11.45,.2,{fontSize:13,bold:true,color:C.blue,align:'center'});footer(s,12); }

// 13. Conclusion
{ const s=slide(); decorate(s,13); header(s,13,'Conclusion'); tx(s,'수학적 모델링이 만든 더 공정한 교실',.62,1.05,10.5,.58,{fontSize:26,bold:true,charSpacing:-1.4});
  const cards=[['이산수학의 실용성','추상적인 가중치 그래프 이론이 실제 학급 운영의 공정한 조 배정 문제를 해결할 수 있음을 확인했습니다.',C.cyan],['AI 디버깅의 핵심','AI에게 원하는 결과가 아니라 목적함수와 제약조건을 수학적으로 알려줘야 정확한 구현이 가능합니다.',C.coral],['향후 발전 방향','성적에 학생 친밀도와 선호도까지 더한 다중 가중치 이분 매칭으로 확장할 계획입니다.',C.sun]];cards.forEach((a,i)=>{const x=.62+i*4.1;rect(s,x,2.08,3.72,2.72,C.white,.12,C.line);rect(s,x+.25,2.35,.55,.12,a[2],.06);tx(s,`0${i+1}`,x+.26,2.7,.55,.17,{fontFace:'Aptos Mono',fontSize:8,bold:true,color:C.muted});tx(s,a[0],x+.25,3.08,3.0,.3,{fontSize:15,bold:true});tx(s,a[1],x+.25,3.65,3.13,.7,{fontSize:11,color:C.muted,breakLine:true,fit:'shrink'});});
  rect(s,.62,5.55,12.06,.88,C.navy,.12);tx(s,'“공정함”을 직관이 아닌, 측정 가능한 가중치와 최적화 문제로 바꾸다.',.92,5.84,11.45,.24,{fontSize:18,bold:true,color:C.white,align:'center',charSpacing:-.7});
  tx(s,'THANK YOU',.62,6.68,2,.22,{fontFace:'Aptos Mono',fontSize:10,bold:true,color:'0C8476',charSpacing:1.3});tx(s,'Q & A',11.92,6.68,.76,.22,{fontFace:'Aptos Mono',fontSize:10,bold:true,color:C.muted,align:'right'}); }

pptx.writeFile({ fileName: 'grade-based-team-matching-presentation.pptx' });
