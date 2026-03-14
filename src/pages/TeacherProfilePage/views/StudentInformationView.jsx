import "./StudentInformationView.css";

function splitName(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "—", lastName: "—" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "—" };

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function displayGrade(student) {
  const grade = student?.grade;
  const instrument = student?.instrument || "Piano";

  if (grade === undefined || grade === null || grade === "") {
    return `Grade — ${instrument}`;
  }

  const gradeText = String(grade).toLowerCase().startsWith("grade")
    ? String(grade)
    : `Grade ${grade}`;

  return `${gradeText} ${instrument}`;
}

export default function StudentInformationView({ student, user }) {
  if (!student) return null;

  const firstName = student.firstName || splitName(student.name).firstName;
  const lastName = student.lastName || splitName(student.name).lastName;

  const linkedParent =
    Array.isArray(student.parentIds) && student.parentIds.length > 0
      ? student.parentIds[0]
      : null;

  const parentFirstName =
    student.parent?.firstName ||
    linkedParent?.firstName ||
    splitName(student.parent?.name || linkedParent?.name || "").firstName ||
    "—";

  const parentLastName =
    student.parent?.lastName ||
    linkedParent?.lastName ||
    splitName(student.parent?.name || linkedParent?.name || "").lastName ||
    "—";

  const studentEmail = student.studentEmail || student.email || "—";

  const parentEmail = student.parent?.email || linkedParent?.email || "—";

  const parentPhone = student.parent?.phone || linkedParent?.phone || "—";

  const examType = student.examType || "Practical";
  const classFrequency = student.classFrequency || "—";
  const classLength = student.classLength || "—";
  const nextLesson = student.nextLessonFull || student.nextLesson || "—";
  const room = student.lessonRoom || "—";
  const teacherName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "—";
  const studentNotes = student.studentNotes || "No student notes added yet.";

  return (
    <div className="siv">
      <header className="siv__topbar">
        <div>
          <h1 className="siv__name">{student.name || "Student"}</h1>
          <p className="siv__sub">
            {displayGrade(student)} · Student Information
          </p>
        </div>
      </header>

      <div className="siv__content">
        <section className="siv__section">
          <h2 className="siv__sectionTitle">Student Details</h2>

          <div className="siv__card siv__card--large">
            <div className="siv__grid siv__grid--2">
              <div className="siv__field">
                <div className="siv__label">First Name</div>
                <div className="siv__value siv__value--serif">{firstName}</div>
              </div>

              <div className="siv__field">
                <div className="siv__label">Last Name</div>
                <div className="siv__value siv__value--serif">{lastName}</div>
              </div>

              <div className="siv__field">
                <div className="siv__label">Student Email</div>
                <div className="siv__value">{studentEmail}</div>
              </div>

              <div className="siv__field">
                <div className="siv__label">Birth Date</div>
                <div className="siv__value">{student.birthDate || "—"}</div>
              </div>

              <div className="siv__field">
                <div className="siv__label">Grade</div>
                <div className="siv__value">{displayGrade(student)}</div>
              </div>

              <div className="siv__field">
                <div className="siv__label">Exam Type</div>
                <div className="siv__value">
                  {student.examType || "ABRSM - Practical"}
                </div>
              </div>

              <div className="siv__field">
                <div className="siv__label">Teacher</div>
                <div className="siv__value">{teacherName}</div>
              </div>
            </div>

            <div className="siv__divider" />

            <div className="siv__field">
              <div className="siv__label">Notes About Student</div>
              <div className="siv__notes">{studentNotes}</div>
            </div>
          </div>
        </section>

        <div className="siv__bottomGrid">
          <section className="siv__section">
            <h2 className="siv__sectionTitle">Parent / Guardian</h2>

            <div className="siv__card">
              <div className="siv__grid siv__grid--2">
                <div className="siv__field">
                  <div className="siv__label">First Name</div>
                  <div className="siv__value siv__value--serif">
                    {parentFirstName}
                  </div>
                </div>

                <div className="siv__field">
                  <div className="siv__label">Last Name</div>
                  <div className="siv__value siv__value--serif">
                    {parentLastName}
                  </div>
                </div>

                <div className="siv__field">
                  <div className="siv__label">Parent Email</div>
                  <div className="siv__value">{parentEmail}</div>
                </div>

                <div className="siv__field">
                  <div className="siv__label">Contact Phone</div>
                  <div className="siv__value">{parentPhone}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="siv__section">
            <h2 className="siv__sectionTitle">Class Schedule</h2>

            <div className="siv__card">
              <div className="siv__grid siv__grid--2">
                <div className="siv__field">
                  <div className="siv__label">Frequency</div>
                  <div className="siv__value">{classFrequency}</div>
                </div>

                <div className="siv__field">
                  <div className="siv__label">Class Length</div>
                  <div className="siv__value">{classLength}</div>
                </div>

                <div className="siv__field">
                  <div className="siv__label">Next Lesson</div>
                  <div className="siv__value">{nextLesson}</div>
                </div>

                <div className="siv__field">
                  <div className="siv__label">Room</div>
                  <div className="siv__value">{room}</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
