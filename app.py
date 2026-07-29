import math
from itertools import combinations

import pandas as pd
import streamlit as st
import streamlit.components.v1 as components


st.set_page_config(page_title="짝꿍 칠판", page_icon="🧸", layout="wide")

SAMPLE = [
    ("민지", 98), ("준호", 94), ("서연", 89), ("도윤", 84),
    ("유나", 78), ("하준", 73), ("지우", 67), ("시우", 61),
    ("채원", 56), ("서준", 51), ("예은", 46), ("건우", 41),
]


def objective(groups, target):
    """Lower is better: the total squared distance from the target team sum."""
    return sum((sum(item["score"] for item in group) - target) ** 2 for group in groups)


def make_groups(students, group_size):
    """Create balanced groups using weighted vacant-slot assignment plus local swaps."""
    team_count = math.ceil(len(students) / group_size)
    capacities = [group_size] * team_count
    capacities[-1] = len(students) - group_size * (team_count - 1)
    target = sum(student["score"] for student in students) / team_count
    groups = [[] for _ in range(team_count)]

    # Descending placement: every vacant team slot is an edge; the best edge
    # minimizes that team's projected squared distance from the target total.
    for student in sorted(students, key=lambda item: item["score"], reverse=True):
        choices = []
        for index, group in enumerate(groups):
            if len(group) < capacities[index]:
                projected = sum(item["score"] for item in group) + student["score"]
                weight = -(projected - target) ** 2
                choices.append((weight, -len(group), -index, index))
        _, _, _, selected = max(choices)
        groups[selected].append(student)

    # Improve the initial weighted matching through score-preserving swaps.
    improved = True
    while improved:
        improved = False
        current = objective(groups, target)
        best = (current, None)
        for left, right in combinations(range(len(groups)), 2):
            for li, left_student in enumerate(groups[left]):
                for ri, right_student in enumerate(groups[right]):
                    groups[left][li], groups[right][ri] = right_student, left_student
                    candidate = objective(groups, target)
                    groups[left][li], groups[right][ri] = left_student, right_student
                    if candidate < best[0] - 1e-9:
                        best = (candidate, (left, li, right, ri))
        if best[1]:
            left, li, right, ri = best[1]
            groups[left][li], groups[right][ri] = groups[right][ri], groups[left][li]
            improved = True

    return sorted(groups, key=lambda group: sum(item["score"] for item in group), reverse=True), target


def graph_html(groups):
    rows = []
    colors = ["#ffb86b", "#86d7c6", "#9db9ff", "#f8a2bd", "#c8adff", "#f5d95d"]
    for i, group in enumerate(groups):
        names = " · ".join(item["name"] for item in group)
        average = sum(item["score"] for item in group) / len(group)
        cards = "".join(
            f'<span class="student"><b>{item["name"]}</b><small>{item["score"]}점</small></span>'
            for item in sorted(group, key=lambda item: item["score"], reverse=True)
        )
        rows.append(
            f'<section class="team" style="--team:{colors[i % len(colors)]}">'
            f'<div class="team-dot">{i + 1}조</div><div class="members">{cards}</div>'
            f'<div class="team-score"><b>{average:.1f}</b><small>평균 점수</small></div>'
            f'<p>{names}</p></section>'
        )
    return f"""
    <style>
    * {{ box-sizing:border-box }} body {{ margin:0; font-family:'Malgun Gothic',sans-serif; color:#31566b; background:#fffdf5 }}
    .board {{ padding:18px; background:linear-gradient(135deg,#fffef9,#eefaff); border:3px dashed #b7dce7; border-radius:22px }}
    .team {{ display:grid; grid-template-columns:60px 1fr 86px; gap:12px; align-items:center; padding:13px 9px; margin:9px 0; background:white; border:1px solid #e4edf0; border-left:8px solid var(--team); border-radius:16px; box-shadow:0 3px 0 #e8f0ef }}
    .team-dot {{ font-weight:800; color:#426276; text-align:center }} .members {{ display:flex; gap:7px; flex-wrap:wrap }}
    .student {{ min-width:66px; padding:7px 8px; background:#f4fbfa; border-radius:10px; text-align:center; border-bottom:2px solid var(--team) }}
    .student b,.student small,.team-score b,.team-score small {{ display:block }} .student b {{ font-size:12px }} .student small {{ margin-top:2px; color:#65808d; font-size:11px }}
    .team-score {{ padding:7px; background:#fff8d9; border-radius:11px; text-align:center }} .team-score b {{ font-size:17px; color:#e07848 }} .team-score small {{ font-size:9px; color:#78909a }}
    .team p {{ grid-column:2/4; margin:0; color:#78909a; font-size:11px }}
    </style><main class="board">{''.join(rows)}</main>"""


st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gowun+Dodum&display=swap');
.stApp { background:radial-gradient(circle at 10% 8%,#fff2c9 0 7%,transparent 7.5%),radial-gradient(circle at 90% 12%,#d9f7f1 0 9%,transparent 9.5%),#fffdf6; color:#31566b; font-family:'Gowun Dodum',sans-serif; }
h1,h2,h3 { font-family:'Gaegu','Gowun Dodum',sans-serif !important; font-weight:700 !important; color:#31566b !important; }
div[data-testid="stSidebar"] { background:#f3fbfb; border-right:2px dashed #b9dedd; }
.hero { padding:20px 24px; border-radius:25px; background:linear-gradient(110deg,#c9f3eb,#e9f6ff 58%,#fff1bd); border:2px solid white; box-shadow:0 7px 0 #d9eae7; margin-bottom:20px; }
.hero h1 { margin:0; font-size:3.1rem !important; letter-spacing:-.05em; }.hero p { margin:.2rem 0 0; font-size:1rem; color:#527182; }
.stButton button { background:#ffae6b !important; color:#563821 !important; border:0 !important; border-bottom:4px solid #de864e !important; border-radius:15px !important; font-family:'Gaegu',sans-serif !important; font-weight:700 !important; font-size:1.2rem !important; }
.stMetric { background:#fff; border:1px solid #e4eff0; border-radius:16px; padding:10px; }.stDataFrame { border-radius:14px; overflow:hidden; }
.note { padding:14px 16px; border-radius:15px; background:#fff5cf; color:#725a2c; border:1px solid #f3df9e; }
</style>
""", unsafe_allow_html=True)

if "students" not in st.session_state:
    st.session_state.students = [{"name": name, "score": score} for name, score in SAMPLE]

with st.sidebar:
    st.markdown("## 🧸 조 편성 설정")
    st.caption("성적을 기준으로 균형 잡힌 조를 만들어요.")
    group_size = st.number_input("한 조당 인원", min_value=2, max_value=8, value=2, step=1)
    st.divider()
    if st.button("✨ 예시 학생 불러오기", use_container_width=True):
        st.session_state.students = [{"name": name, "score": score} for name, score in SAMPLE]
    if st.button("🧹 학생 목록 비우기", use_container_width=True):
        st.session_state.students = []

st.markdown("""
<div class="hero"><h1>짝꿍 칠판 🧸</h1><p>가중치 이분 그래프로 만드는 성적 맞춤형 조 배정</p></div>
""", unsafe_allow_html=True)

left, right = st.columns([1.15, .85], gap="large")
with left:
    st.markdown("## 1. 학생 성적 입력")
    st.caption("이름과 성적을 입력하거나 표에서 직접 수정하세요. 성적은 0점에서 100점 사이여야 합니다.")
    edited = st.data_editor(
        pd.DataFrame(st.session_state.students),
        column_config={"name": st.column_config.TextColumn("학생 이름", required=True), "score": st.column_config.NumberColumn("성적", min_value=0, max_value=100, required=True, step=1)},
        num_rows="dynamic", use_container_width=True, hide_index=True, key="student_editor",
    )
    if st.button("🎒 이 성적으로 조 편성하기", type="primary", use_container_width=True):
        prepared = []
        errors = []
        for row in edited.to_dict("records"):
            name = str(row.get("name") or "").strip()
            score = row.get("score")
            if not name or pd.isna(score):
                continue
            if not 0 <= float(score) <= 100:
                errors.append(name or "이름 없는 학생")
            else:
                prepared.append({"name": name, "score": float(score)})
        if errors:
            st.error("성적은 0점에서 100점 사이로 입력해 주세요: " + ", ".join(errors))
        elif len(prepared) < group_size:
            st.error(f"최소 {group_size}명 이상의 학생을 입력해 주세요.")
        else:
            st.session_state.students = prepared
            st.session_state.result = make_groups(prepared, group_size)

with right:
    st.markdown("## 2. 매칭 원리")
    st.markdown("""
    <div class="note"><b>가중치 이분 그래프</b><br>학생과 조의 빈자리를 연결하고, 목표 평균에 가까울수록 높은 가중치를 부여합니다.<br><br><b>최적화</b><br>초기 배정 후 학생끼리 교환해 조별 성적 합의 편차를 더 줄입니다.</div>
    """, unsafe_allow_html=True)
    st.markdown("#### 가중치 식")
    st.code("weight = 100 - |목표 조 평균 - 예상 조 평균|", language="python")

if "result" in st.session_state:
    groups, target = st.session_state.result
    averages = [sum(item["score"] for item in group) / len(group) for group in groups]
    st.markdown("---")
    st.markdown("## 3. 균형 조 편성 결과")
    metrics = st.columns(4)
    metrics[0].metric("학생 수", sum(len(group) for group in groups))
    metrics[1].metric("조 개수", len(groups))
    metrics[2].metric("목표 조 합", f"{target:.1f}점")
    metrics[3].metric("평균 점수 오차", f"{max(averages) - min(averages):.1f}점")
    components.html(graph_html(groups), height=150 + 120 * len(groups), scrolling=True)

    result_rows = []
    for i, group in enumerate(groups, 1):
        total = sum(item["score"] for item in group)
        result_rows.append({"조": f"{i}조", "조원": ", ".join(f'{item["name"]} ({item["score"]:g})' for item in group), "성적 합": total, "평균": round(total / len(group), 1), "목표 합과 차이": round(abs(total - target), 1)})
    st.dataframe(pd.DataFrame(result_rows), use_container_width=True, hide_index=True)
    st.download_button("📥 조 편성 결과 CSV 다운로드", pd.DataFrame(result_rows).to_csv(index=False).encode("utf-8-sig"), "balanced_team_assignment.csv", "text/csv", use_container_width=True)
else:
    st.info("왼쪽 표에 학생을 입력한 뒤 ‘이 성적으로 조 편성하기’를 눌러 주세요.")
