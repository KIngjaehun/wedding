import React, { useState, useEffect, useRef } from "react";

// Premium Korean Wedding Invitation
// 프리미엄 모바일 청첩장

const WeddingInvitation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState([
    {
      id: 1,
      name: "김영희",
      message: "두 분의 앞날에 행복만 가득하길 바랍니다. 결혼 축하드려요! 💕",
      date: "2027.04.20",
    },
    {
      id: 2,
      name: "박철수",
      message: "친구야 축하해! 행복하게 잘 살아~",
      date: "2027.04.19",
    },
  ]);
  const [newEntry, setNewEntry] = useState({
    name: "",
    password: "",
    message: "",
  });
  const [attendance, setAttendance] = useState({
    attending: null,
    count: 1,
    meal: null,
  });
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 웨딩 정보 설정
  const weddingInfo = {
    groom: { name: "김재훈", father: "김정권", mother: "전미선" },
    bride: { name: "정예주", father: "정OO", mother: "박시원" },
    date: "2027년 5월 15일 토요일 오후 1시",
    venue: "의정부 낙원웨딩홀",
    address: "경기도 의정부시 평화로 525",
    groomAccount: {
      bank: "신한은행",
      number: "110-123-456789",
      holder: "김재훈",
    },
    brideAccount: {
      bank: "국민은행",
      number: "123-45-6789012",
      holder: "정예주",
    },
    groomFatherAccount: {
      bank: "우리은행",
      number: "1002-123-456789",
      holder: "김정권",
    },
    brideFatherAccount: {
      bank: "하나은행",
      number: "123-456789-12345",
      holder: "정OO",
    },
  };

  // 갤러리 이미지 (실제 사용시 교체)
  const galleryImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
  ];

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  // D-Day 계산
  const calculateDday = () => {
    const weddingDate = new Date("2027-05-15");
    const today = new Date();
    const diff = Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24));
    return diff > 0
      ? `D-${diff}`
      : diff === 0
      ? "D-Day"
      : `D+${Math.abs(diff)}`;
  };

  // 카카오맵 열기
  const openKakaoMap = () => {
    window.open(
      "https://map.kakao.com/link/search/" +
        encodeURIComponent(weddingInfo.address),
      "_blank"
    );
  };

  // 네이버맵 열기
  const openNaverMap = () => {
    window.open(
      "https://map.naver.com/v5/search/" +
        encodeURIComponent(weddingInfo.address),
      "_blank"
    );
  };

  // 계좌번호 복사
  const copyAccount = (account) => {
    navigator.clipboard.writeText(account.number);
    setCopySuccess(account.holder);
    setTimeout(() => setCopySuccess(""), 2000);
  };

  // 카카오톡 공유
  const shareKakao = () => {
    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${weddingInfo.groom.name} ♥ ${weddingInfo.bride.name} 결혼합니다`,
          description: weddingInfo.date,
          imageUrl: galleryImages[0],
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    }
  };

  // URL 복사
  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess("URL");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  // 방명록 추가
  const addGuestbookEntry = () => {
    if (newEntry.name && newEntry.message && newEntry.password) {
      setGuestbookEntries([
        {
          id: Date.now(),
          name: newEntry.name,
          message: newEntry.message,
          date: new Date()
            .toLocaleDateString("ko-KR")
            .replace(/\./g, ".")
            .slice(0, -1),
        },
        ...guestbookEntries,
      ]);
      setNewEntry({ name: "", password: "", message: "" });
    }
  };

  // 캘린더에 추가
  const addToCalendar = () => {
    const event = {
      title: `${weddingInfo.groom.name} ♥ ${weddingInfo.bride.name} 결혼식`,
      start: "20270515T130000",
      end: "20270515T160000",
      location: weddingInfo.venue,
    };
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding.ics";
    a.click();
  };

  return (
    <div style={styles.container}>
      {/* 배경 장식 */}
      <div style={styles.backgroundPattern} />

      {/* 플로팅 음악 버튼 */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        style={styles.musicButton}
        aria-label="배경음악 재생/정지"
      >
        {isPlaying ? "♪" : "♪"}
        <span style={styles.musicWave(isPlaying)} />
      </button>

      {/* 인트로 섹션 */}
      <section style={styles.introSection(isLoaded)}>
        <div style={styles.floralTop} />
        <p style={styles.introLabel}>WEDDING INVITATION</p>
        <h1 style={styles.coupleNames}>
          <span style={styles.groomName}>{weddingInfo.groom.name}</span>
          <span style={styles.heart}>♥</span>
          <span style={styles.brideName}>{weddingInfo.bride.name}</span>
        </h1>
        <div style={styles.dateWrapper}>
          <p style={styles.weddingDate}>{weddingInfo.date}</p>
          <p style={styles.venue}>{weddingInfo.venue}</p>
        </div>
        <div style={styles.ddayBadge}>{calculateDday()}</div>
        <div style={styles.scrollIndicator}>
          <span style={styles.scrollText}>스크롤하여 청첩장 보기</span>
          <div style={styles.scrollArrow}>↓</div>
        </div>
      </section>

      {/* 메인 이미지 */}
      <section style={styles.mainImageSection}>
        <div style={styles.mainImageWrapper}>
          <img
            src={galleryImages[0]}
            alt="웨딩 메인 사진"
            style={styles.mainImage}
          />
          <div style={styles.mainImageOverlay} />
        </div>
      </section>

      {/* 인사말 */}
      <section style={styles.greetingSection}>
        <div style={styles.ornamentTop}>❧</div>
        <h2 style={styles.sectionTitle}>초대합니다</h2>
        <p style={styles.greetingText}>
          서로 다른 길을 걸어온 두 사람이
          <br />
          이제 같은 길을 함께 걸어가려 합니다.
          <br />
          <br />
          저희 두 사람이 사랑으로 만나
          <br />
          믿음과 신의로 한 가정을 이루려 합니다.
          <br />
          <br />
          오셔서 축하해 주시면
          <br />
          더없는 기쁨으로 간직하겠습니다.
        </p>
        <div style={styles.ornamentBottom}>❧</div>
      </section>

      {/* 혼주 소개 */}
      <section style={styles.familySection}>
        <div style={styles.familyCard}>
          <div style={styles.familyRow}>
            <span style={styles.familyLabel}>신랑측</span>
            <span style={styles.familyNames}>
              {weddingInfo.groom.father} · {weddingInfo.groom.mother}
              <span style={styles.familyRelation}>의 아들</span>
              <strong>{weddingInfo.groom.name}</strong>
            </span>
          </div>
          <div style={styles.familyDivider} />
          <div style={styles.familyRow}>
            <span style={styles.familyLabel}>신부측</span>
            <span style={styles.familyNames}>
              {weddingInfo.bride.father} · {weddingInfo.bride.mother}
              <span style={styles.familyRelation}>의 딸</span>
              <strong>{weddingInfo.bride.name}</strong>
            </span>
          </div>
        </div>

        {/* 연락하기 버튼 */}
        <div style={styles.contactButtons}>
          <a href="tel:010-1234-5678" style={styles.contactBtn}>
            <span style={styles.contactIcon}>📞</span>
            <span>신랑에게 연락</span>
          </a>
          <a href="tel:010-8765-4321" style={styles.contactBtn}>
            <span style={styles.contactIcon}>📞</span>
            <span>신부에게 연락</span>
          </a>
        </div>
      </section>

      {/* 갤러리 */}
      <section style={styles.gallerySection}>
        <h2 style={styles.sectionTitle}>갤러리</h2>
        <p style={styles.sectionSubtitle}>Our Precious Moments</p>

        <div style={styles.mainGalleryImage}>
          <img
            src={galleryImages[currentImageIndex]}
            alt={`갤러리 이미지 ${currentImageIndex + 1}`}
            style={styles.galleryMainImg}
          />
          <button
            style={styles.galleryNavLeft}
            onClick={() =>
              setCurrentImageIndex(
                (currentImageIndex - 1 + galleryImages.length) %
                  galleryImages.length
              )
            }
          >
            ‹
          </button>
          <button
            style={styles.galleryNavRight}
            onClick={() =>
              setCurrentImageIndex(
                (currentImageIndex + 1) % galleryImages.length
              )
            }
          >
            ›
          </button>
        </div>

        <div style={styles.galleryThumbnails}>
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              style={styles.thumbnail(idx === currentImageIndex)}
            >
              <img src={img} alt="" style={styles.thumbnailImg} />
            </div>
          ))}
        </div>

        <div style={styles.galleryDots}>
          {galleryImages.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              style={styles.galleryDot(idx === currentImageIndex)}
            />
          ))}
        </div>
      </section>

      {/* 캘린더 */}
      <section style={styles.calendarSection}>
        <h2 style={styles.sectionTitle}>예식 일시</h2>
        <p style={styles.calendarDate}>2027. 05. 15. SAT PM 1:00</p>

        <div style={styles.calendarGrid}>
          <div style={styles.calendarHeader}>
            <span>일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
          </div>
          <div style={styles.calendarBody}>
            {/* 5월 캘린더 */}
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const dayOfWeek = new Date(2027, 4, day).getDay();
              const isWeddingDay = day === 15;
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              // 첫째 주 빈칸
              if (day === 1) {
                const emptyDays = new Date(2027, 4, 1).getDay();
                const empties = [...Array(emptyDays)].map((_, j) => (
                  <span key={`empty-${j}`} style={styles.calendarEmpty} />
                ));
                return [
                  ...empties,
                  <span
                    key={day}
                    style={styles.calendarDay(
                      isWeddingDay,
                      isSunday,
                      isSaturday
                    )}
                  >
                    {day}
                    {isWeddingDay && <span style={styles.weddingMark}>♥</span>}
                  </span>,
                ];
              }

              return (
                <span
                  key={day}
                  style={styles.calendarDay(isWeddingDay, isSunday, isSaturday)}
                >
                  {day}
                  {isWeddingDay && <span style={styles.weddingMark}>♥</span>}
                </span>
              );
            })}
          </div>
        </div>

        <button onClick={addToCalendar} style={styles.addCalendarBtn}>
          📅 캘린더에 일정 추가
        </button>
      </section>

      {/* 오시는 길 */}
      <section style={styles.locationSection}>
        <h2 style={styles.sectionTitle}>오시는 길</h2>
        <p style={styles.venueName}>{weddingInfo.venue}</p>
        <p style={styles.venueAddress}>{weddingInfo.address}</p>

        {/* 지도 플레이스홀더 */}
        <div style={styles.mapPlaceholder}>
          <div style={styles.mapOverlay}>
            <p>지도를 클릭하여 길찾기</p>
          </div>
        </div>

        <div style={styles.mapButtons}>
          <button onClick={openKakaoMap} style={styles.mapBtn}>
            <span style={styles.mapIcon}>🗺️</span>
            카카오맵
          </button>
          <button onClick={openNaverMap} style={styles.mapBtn}>
            <span style={styles.mapIcon}>🗺️</span>
            네이버지도
          </button>
          <button
            onClick={() =>
              navigator.clipboard.writeText(weddingInfo.address).then(() => {
                setCopySuccess("주소");
                setTimeout(() => setCopySuccess(""), 2000);
              })
            }
            style={styles.mapBtn}
          >
            <span style={styles.mapIcon}>📋</span>
            주소복사
          </button>
        </div>

        {/* 교통 안내 */}
        <div style={styles.transportInfo}>
          <div style={styles.transportItem}>
            <h4 style={styles.transportTitle}>🚇 지하철</h4>
            <p style={styles.transportText}>
              1호선 의정부역 1번 출구에서 도보 5분
            </p>
          </div>
          <div style={styles.transportItem}>
            <h4 style={styles.transportTitle}>🚌 버스</h4>
            <p style={styles.transportText}>1, 1-1, 36, 72 의정부역 하차</p>
          </div>
          <div style={styles.transportItem}>
            <h4 style={styles.transportTitle}>🚗 자가용</h4>
            <p style={styles.transportText}>건물 내 주차장 이용 가능</p>
          </div>
        </div>
      </section>

      {/* 마음 전하기 (계좌번호) */}
      <section style={styles.accountSection}>
        <h2 style={styles.sectionTitle}>마음 전하기</h2>
        <p style={styles.sectionSubtitle}>축하의 마음을 전해주세요</p>

        <div style={styles.accountTabs}>
          <button
            onClick={() => setActiveSection(0)}
            style={styles.accountTab(activeSection === 0)}
          >
            신랑측
          </button>
          <button
            onClick={() => setActiveSection(1)}
            style={styles.accountTab(activeSection === 1)}
          >
            신부측
          </button>
        </div>

        <div style={styles.accountCards}>
          {activeSection === 0 ? (
            <>
              <div style={styles.accountCard}>
                <p style={styles.accountLabel}>
                  신랑 {weddingInfo.groomAccount.holder}
                </p>
                <p style={styles.accountNumber}>
                  {weddingInfo.groomAccount.bank}{" "}
                  {weddingInfo.groomAccount.number}
                </p>
                <button
                  onClick={() => copyAccount(weddingInfo.groomAccount)}
                  style={styles.copyBtn}
                >
                  {copySuccess === weddingInfo.groomAccount.holder
                    ? "복사완료 ✓"
                    : "복사하기"}
                </button>
              </div>
              <div style={styles.accountCard}>
                <p style={styles.accountLabel}>
                  신랑 아버지 {weddingInfo.groomFatherAccount.holder}
                </p>
                <p style={styles.accountNumber}>
                  {weddingInfo.groomFatherAccount.bank}{" "}
                  {weddingInfo.groomFatherAccount.number}
                </p>
                <button
                  onClick={() => copyAccount(weddingInfo.groomFatherAccount)}
                  style={styles.copyBtn}
                >
                  {copySuccess === weddingInfo.groomFatherAccount.holder
                    ? "복사완료 ✓"
                    : "복사하기"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={styles.accountCard}>
                <p style={styles.accountLabel}>
                  신부 {weddingInfo.brideAccount.holder}
                </p>
                <p style={styles.accountNumber}>
                  {weddingInfo.brideAccount.bank}{" "}
                  {weddingInfo.brideAccount.number}
                </p>
                <button
                  onClick={() => copyAccount(weddingInfo.brideAccount)}
                  style={styles.copyBtn}
                >
                  {copySuccess === weddingInfo.brideAccount.holder
                    ? "복사완료 ✓"
                    : "복사하기"}
                </button>
              </div>
              <div style={styles.accountCard}>
                <p style={styles.accountLabel}>
                  신부 아버지 {weddingInfo.brideFatherAccount.holder}
                </p>
                <p style={styles.accountNumber}>
                  {weddingInfo.brideFatherAccount.bank}{" "}
                  {weddingInfo.brideFatherAccount.number}
                </p>
                <button
                  onClick={() => copyAccount(weddingInfo.brideFatherAccount)}
                  style={styles.copyBtn}
                >
                  {copySuccess === weddingInfo.brideFatherAccount.holder
                    ? "복사완료 ✓"
                    : "복사하기"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 참석 여부 */}
      <section style={styles.attendanceSection}>
        <h2 style={styles.sectionTitle}>참석 여부</h2>
        <p style={styles.sectionSubtitle}>참석 여부를 알려주세요</p>

        <button
          onClick={() => setShowAttendanceModal(true)}
          style={styles.attendanceBtn}
        >
          📝 참석 여부 전달하기
        </button>
      </section>

      {/* 참석 여부 모달 */}
      {showAttendanceModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowAttendanceModal(false)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAttendanceModal(false)}
              style={styles.modalClose}
            >
              ×
            </button>
            <h3 style={styles.modalTitle}>참석 여부 전달</h3>

            <div style={styles.attendanceForm}>
              <label style={styles.formLabel}>참석 여부</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="attending"
                    checked={attendance.attending === true}
                    onChange={() =>
                      setAttendance({ ...attendance, attending: true })
                    }
                    style={styles.radioInput}
                  />
                  <span
                    style={styles.radioCustom(attendance.attending === true)}
                  >
                    참석
                  </span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="attending"
                    checked={attendance.attending === false}
                    onChange={() =>
                      setAttendance({ ...attendance, attending: false })
                    }
                    style={styles.radioInput}
                  />
                  <span
                    style={styles.radioCustom(attendance.attending === false)}
                  >
                    불참
                  </span>
                </label>
              </div>

              {attendance.attending && (
                <>
                  <label style={styles.formLabel}>참석 인원</label>
                  <div style={styles.counterGroup}>
                    <button
                      onClick={() =>
                        setAttendance({
                          ...attendance,
                          count: Math.max(1, attendance.count - 1),
                        })
                      }
                      style={styles.counterBtn}
                    >
                      −
                    </button>
                    <span style={styles.counterValue}>
                      {attendance.count}명
                    </span>
                    <button
                      onClick={() =>
                        setAttendance({
                          ...attendance,
                          count: attendance.count + 1,
                        })
                      }
                      style={styles.counterBtn}
                    >
                      +
                    </button>
                  </div>

                  <label style={styles.formLabel}>식사 여부</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="meal"
                        checked={attendance.meal === true}
                        onChange={() =>
                          setAttendance({ ...attendance, meal: true })
                        }
                        style={styles.radioInput}
                      />
                      <span
                        style={styles.radioCustom(attendance.meal === true)}
                      >
                        예정
                      </span>
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="meal"
                        checked={attendance.meal === false}
                        onChange={() =>
                          setAttendance({ ...attendance, meal: false })
                        }
                        style={styles.radioInput}
                      />
                      <span
                        style={styles.radioCustom(attendance.meal === false)}
                      >
                        미정
                      </span>
                    </label>
                  </div>
                </>
              )}

              <button style={styles.submitBtn}>전달하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 방명록 */}
      <section style={styles.guestbookSection}>
        <h2 style={styles.sectionTitle}>방명록</h2>
        <p style={styles.sectionSubtitle}>축하 메시지를 남겨주세요</p>

        <div style={styles.guestbookForm}>
          <div style={styles.formRow}>
            <input
              type="text"
              placeholder="이름"
              value={newEntry.name}
              onChange={(e) =>
                setNewEntry({ ...newEntry, name: e.target.value })
              }
              style={styles.formInput}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={newEntry.password}
              onChange={(e) =>
                setNewEntry({ ...newEntry, password: e.target.value })
              }
              style={styles.formInput}
            />
          </div>
          <textarea
            placeholder="축하 메시지를 남겨주세요"
            value={newEntry.message}
            onChange={(e) =>
              setNewEntry({ ...newEntry, message: e.target.value })
            }
            style={styles.formTextarea}
          />
          <button onClick={addGuestbookEntry} style={styles.guestbookSubmitBtn}>
            등록하기
          </button>
        </div>

        <div style={styles.guestbookList}>
          {guestbookEntries.map((entry) => (
            <div key={entry.id} style={styles.guestbookEntry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryName}>{entry.name}</span>
                <span style={styles.entryDate}>{entry.date}</span>
              </div>
              <p style={styles.entryMessage}>{entry.message}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 공유하기 */}
      <section style={styles.shareSection}>
        <h2 style={styles.sectionTitle}>공유하기</h2>

        <div style={styles.shareButtons}>
          <button
            onClick={shareKakao}
            style={styles.shareBtn("#FEE500", "#191919")}
          >
            <span style={styles.shareBtnIcon}>💬</span>
            카카오톡
          </button>
          <button onClick={copyUrl} style={styles.shareBtn("#E8E8E8", "#333")}>
            <span style={styles.shareBtnIcon}>🔗</span>
            {copySuccess === "URL" ? "복사완료!" : "URL 복사"}
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={styles.footer}>
        <div style={styles.footerFloral}>✿</div>
        <p style={styles.footerText}>
          {weddingInfo.groom.name} ♥ {weddingInfo.bride.name}
        </p>
        <p style={styles.footerDate}>{weddingInfo.date}</p>
        <p style={styles.footerCopyright}>Made with ❤️</p>
      </footer>

      {/* 복사 성공 토스트 */}
      {copySuccess && <div style={styles.toast}>{copySuccess} 복사 완료!</div>}
    </div>
  );
};

// 스타일 정의
const styles = {
  container: {
    maxWidth: "100%",
    width: "100%",
    minHeight: "100vh",
    margin: "0 auto",
    fontFamily: '"Noto Serif KR", "Times New Roman", serif',
    backgroundColor: "#FBF9F7",
    color: "#3D3D3D",
    overflowX: "hidden",
    position: "relative",
  },

  backgroundPattern: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(200, 170, 140, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(180, 150, 130, 0.1) 0%, transparent 50%)
    `,
    pointerEvents: "none",
    zIndex: 0,
  },

  musicButton: {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "1px solid #C9A87C",
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "#C9A87C",
    fontSize: "18px",
    cursor: "pointer",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },

  musicWave: (isPlaying) => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "2px solid #C9A87C",
    animation: isPlaying ? "pulse 1.5s infinite" : "none",
    opacity: isPlaying ? 1 : 0,
  }),

  // 인트로 섹션
  introSection: (isLoaded) => ({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
    textAlign: "center",
    position: "relative",
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? "translateY(0)" : "translateY(20px)",
    transition: "all 1s ease-out",
  }),

  floralTop: {
    width: "120px",
    height: "60px",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Cpath d='M50 45 Q30 30 10 40 Q25 25 50 10 Q75 25 90 40 Q70 30 50 45' fill='none' stroke='%23C9A87C' stroke-width='1'/%3E%3C/svg%3E\")",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    marginBottom: "30px",
    opacity: 0.7,
  },

  introLabel: {
    fontSize: "11px",
    letterSpacing: "4px",
    color: "#A08060",
    marginBottom: "24px",
    fontFamily: '"Cormorant Garamond", serif',
  },

  coupleNames: {
    fontSize: "28px",
    fontWeight: "400",
    letterSpacing: "2px",
    marginBottom: "32px",
    lineHeight: 1.6,
  },

  groomName: {
    color: "#5C4A3D",
  },

  heart: {
    display: "inline-block",
    color: "#C9A87C",
    margin: "0 16px",
    fontSize: "20px",
  },

  brideName: {
    color: "#5C4A3D",
  },

  dateWrapper: {
    marginBottom: "32px",
  },

  weddingDate: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
    letterSpacing: "1px",
  },

  venue: {
    fontSize: "13px",
    color: "#888",
    letterSpacing: "0.5px",
  },

  ddayBadge: {
    display: "inline-block",
    padding: "8px 24px",
    backgroundColor: "#C9A87C",
    color: "#FFF",
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "2px",
    borderRadius: "20px",
    marginBottom: "48px",
  },

  scrollIndicator: {
    position: "absolute",
    bottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "bounce 2s infinite",
  },

  scrollText: {
    fontSize: "11px",
    color: "#999",
    marginBottom: "8px",
    letterSpacing: "1px",
  },

  scrollArrow: {
    fontSize: "16px",
    color: "#C9A87C",
  },

  // 메인 이미지
  mainImageSection: {
    padding: "0",
  },

  mainImageWrapper: {
    position: "relative",
    width: "100%",
    paddingTop: "125%",
    overflow: "hidden",
  },

  mainImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  mainImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(to bottom, transparent 70%, rgba(251,249,247,1) 100%)",
  },

  // 섹션 공통
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "400",
    color: "#4A4A4A",
    marginBottom: "8px",
    letterSpacing: "3px",
  },

  sectionSubtitle: {
    fontSize: "12px",
    color: "#999",
    marginBottom: "32px",
    letterSpacing: "1px",
    fontFamily: '"Cormorant Garamond", serif',
  },

  // 인사말 섹션
  greetingSection: {
    padding: "80px 32px",
    textAlign: "center",
    backgroundColor: "#FBF9F7",
  },

  ornamentTop: {
    fontSize: "24px",
    color: "#C9A87C",
    marginBottom: "24px",
    opacity: 0.6,
  },

  ornamentBottom: {
    fontSize: "24px",
    color: "#C9A87C",
    marginTop: "24px",
    opacity: 0.6,
    transform: "rotate(180deg)",
  },

  greetingText: {
    fontSize: "14px",
    lineHeight: 2.2,
    color: "#5A5A5A",
    wordBreak: "keep-all",
  },

  // 혼주 섹션
  familySection: {
    padding: "60px 24px",
    backgroundColor: "#F7F4F1",
  },

  familyCard: {
    backgroundColor: "#FFF",
    borderRadius: "12px",
    padding: "32px 24px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
  },

  familyRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "8px",
  },

  familyLabel: {
    fontSize: "11px",
    color: "#A08060",
    letterSpacing: "2px",
    marginBottom: "4px",
  },

  familyNames: {
    fontSize: "14px",
    color: "#5A5A5A",
    lineHeight: 1.8,
  },

  familyRelation: {
    display: "block",
    fontSize: "12px",
    color: "#999",
    margin: "4px 0",
  },

  familyDivider: {
    width: "40px",
    height: "1px",
    backgroundColor: "#E0D5C8",
    margin: "24px auto",
  },

  contactButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    justifyContent: "center",
  },

  contactBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "12px 20px",
    backgroundColor: "#FFF",
    border: "1px solid #E0D5C8",
    borderRadius: "25px",
    fontSize: "13px",
    color: "#5A5A5A",
    textDecoration: "none",
    transition: "all 0.2s",
  },

  contactIcon: {
    fontSize: "14px",
  },

  // 갤러리
  gallerySection: {
    padding: "60px 24px",
    textAlign: "center",
    backgroundColor: "#FBF9F7",
  },

  mainGalleryImage: {
    position: "relative",
    width: "100%",
    paddingTop: "100%",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "16px",
  },

  galleryMainImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  galleryNavLeft: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "rgba(255,255,255,0.9)",
    fontSize: "20px",
    color: "#5A5A5A",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  galleryNavRight: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "rgba(255,255,255,0.9)",
    fontSize: "20px",
    color: "#5A5A5A",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  galleryThumbnails: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    padding: "8px 0",
    scrollbarWidth: "none",
  },

  thumbnail: (isActive) => ({
    flexShrink: 0,
    width: "56px",
    height: "56px",
    borderRadius: "6px",
    overflow: "hidden",
    cursor: "pointer",
    border: isActive ? "2px solid #C9A87C" : "2px solid transparent",
    opacity: isActive ? 1 : 0.6,
    transition: "all 0.2s",
  }),

  thumbnailImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  galleryDots: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "16px",
  },

  galleryDot: (isActive) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: isActive ? "#C9A87C" : "#DDD",
    cursor: "pointer",
    transition: "all 0.2s",
  }),

  // 캘린더
  calendarSection: {
    padding: "60px 24px",
    textAlign: "center",
    backgroundColor: "#F7F4F1",
  },

  calendarDate: {
    fontSize: "16px",
    color: "#5A5A5A",
    marginBottom: "32px",
    letterSpacing: "2px",
    fontFamily: '"Cormorant Garamond", serif',
  },

  calendarGrid: {
    backgroundColor: "#FFF",
    borderRadius: "12px",
    padding: "24px 16px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
    marginBottom: "24px",
  },

  calendarHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    marginBottom: "16px",
    fontSize: "12px",
    color: "#999",
  },

  calendarBody: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
  },

  calendarEmpty: {
    padding: "10px",
  },

  calendarDay: (isWeddingDay, isSunday, isSaturday) => ({
    position: "relative",
    padding: "10px",
    fontSize: "14px",
    color: isWeddingDay
      ? "#FFF"
      : isSunday
      ? "#E57373"
      : isSaturday
      ? "#64B5F6"
      : "#5A5A5A",
    backgroundColor: isWeddingDay ? "#C9A87C" : "transparent",
    borderRadius: isWeddingDay ? "50%" : "0",
    fontWeight: isWeddingDay ? "600" : "400",
  }),

  weddingMark: {
    position: "absolute",
    bottom: "2px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "8px",
    color: "#FFF",
  },

  addCalendarBtn: {
    padding: "14px 32px",
    backgroundColor: "transparent",
    border: "1px solid #C9A87C",
    borderRadius: "25px",
    color: "#C9A87C",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // 오시는 길
  locationSection: {
    padding: "60px 24px",
    textAlign: "center",
    backgroundColor: "#FBF9F7",
  },

  venueName: {
    fontSize: "16px",
    color: "#4A4A4A",
    marginBottom: "8px",
    fontWeight: "500",
  },

  venueAddress: {
    fontSize: "13px",
    color: "#888",
    marginBottom: "24px",
  },

  mapPlaceholder: {
    position: "relative",
    width: "100%",
    height: "200px",
    backgroundColor: "#E8E4E0",
    borderRadius: "12px",
    marginBottom: "16px",
    overflow: "hidden",
  },

  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    fontSize: "13px",
    color: "#888",
  },

  mapButtons: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "32px",
  },

  mapBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "12px 16px",
    backgroundColor: "#FFF",
    border: "1px solid #E0D5C8",
    borderRadius: "25px",
    fontSize: "12px",
    color: "#5A5A5A",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  mapIcon: {
    fontSize: "14px",
  },

  transportInfo: {
    backgroundColor: "#FFF",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
    textAlign: "left",
  },

  transportItem: {
    marginBottom: "16px",
  },

  transportTitle: {
    fontSize: "13px",
    color: "#5A5A5A",
    marginBottom: "6px",
    fontWeight: "500",
  },

  transportText: {
    fontSize: "12px",
    color: "#888",
    lineHeight: 1.6,
  },

  // 마음 전하기
  accountSection: {
    padding: "60px 24px",
    textAlign: "center",
    backgroundColor: "#F7F4F1",
  },

  accountTabs: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "24px",
  },

  accountTab: (isActive) => ({
    padding: "10px 28px",
    backgroundColor: isActive ? "#C9A87C" : "transparent",
    border: isActive ? "none" : "1px solid #C9A87C",
    borderRadius: "25px",
    color: isActive ? "#FFF" : "#C9A87C",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  }),

  accountCards: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  accountCard: {
    backgroundColor: "#FFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
  },

  accountLabel: {
    fontSize: "12px",
    color: "#999",
    marginBottom: "8px",
  },

  accountNumber: {
    fontSize: "14px",
    color: "#4A4A4A",
    marginBottom: "12px",
    letterSpacing: "0.5px",
  },

  copyBtn: {
    padding: "8px 24px",
    backgroundColor: "#F5F2EF",
    border: "none",
    borderRadius: "20px",
    color: "#5A5A5A",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // 참석 여부
  attendanceSection: {
    padding: "60px 24px",
    textAlign: "center",
    backgroundColor: "#FBF9F7",
  },

  attendanceBtn: {
    padding: "16px 40px",
    backgroundColor: "#C9A87C",
    border: "none",
    borderRadius: "30px",
    color: "#FFF",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(201,168,124,0.3)",
    transition: "all 0.2s",
  },

  // 모달
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "24px",
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "360px",
    backgroundColor: "#FFF",
    borderRadius: "16px",
    padding: "32px 24px",
  },

  modalClose: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "32px",
    height: "32px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "24px",
    color: "#999",
    cursor: "pointer",
  },

  modalTitle: {
    fontSize: "18px",
    color: "#4A4A4A",
    marginBottom: "24px",
    textAlign: "center",
  },

  attendanceForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  formLabel: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "-12px",
  },

  radioGroup: {
    display: "flex",
    gap: "12px",
  },

  radioLabel: {
    flex: 1,
    cursor: "pointer",
  },

  radioInput: {
    display: "none",
  },

  radioCustom: (isSelected) => ({
    display: "block",
    padding: "12px",
    textAlign: "center",
    backgroundColor: isSelected ? "#C9A87C" : "#F5F2EF",
    color: isSelected ? "#FFF" : "#666",
    borderRadius: "8px",
    fontSize: "13px",
    transition: "all 0.2s",
  }),

  counterGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },

  counterBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid #E0D5C8",
    backgroundColor: "#FFF",
    fontSize: "18px",
    color: "#5A5A5A",
    cursor: "pointer",
  },

  counterValue: {
    fontSize: "16px",
    color: "#4A4A4A",
    minWidth: "50px",
    textAlign: "center",
  },

  submitBtn: {
    padding: "14px",
    backgroundColor: "#C9A87C",
    border: "none",
    borderRadius: "8px",
    color: "#FFF",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "8px",
  },

  // 방명록
  guestbookSection: {
    padding: "60px 24px",
    textAlign: "center",
    backgroundColor: "#F7F4F1",
  },

  guestbookForm: {
    marginBottom: "32px",
  },

  formRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },

  formInput: {
    flex: 1,
    padding: "14px 16px",
    border: "1px solid #E0D5C8",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#FFF",
    outline: "none",
  },

  formTextarea: {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #E0D5C8",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#FFF",
    outline: "none",
    resize: "none",
    height: "100px",
    marginBottom: "12px",
    boxSizing: "border-box",
  },

  guestbookSubmitBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#C9A87C",
    border: "none",
    borderRadius: "8px",
    color: "#FFF",
    fontSize: "14px",
    cursor: "pointer",
  },

  guestbookList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  guestbookEntry: {
    backgroundColor: "#FFF",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "left",
    boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
  },

  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  entryName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4A4A4A",
  },

  entryDate: {
    fontSize: "11px",
    color: "#999",
  },

  entryMessage: {
    fontSize: "13px",
    color: "#666",
    lineHeight: 1.7,
  },

  // 공유하기
  shareSection: {
    padding: "60px 24px",
    textAlign: "center",
    backgroundColor: "#FBF9F7",
  },

  shareButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },

  shareBtn: (bgColor, textColor) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 24px",
    backgroundColor: bgColor,
    border: "none",
    borderRadius: "25px",
    color: textColor,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  }),

  shareBtnIcon: {
    fontSize: "16px",
  },

  // 푸터
  footer: {
    padding: "60px 24px 40px",
    textAlign: "center",
    backgroundColor: "#F0EBE6",
  },

  footerFloral: {
    fontSize: "28px",
    color: "#C9A87C",
    marginBottom: "20px",
    opacity: 0.6,
  },

  footerText: {
    fontSize: "16px",
    color: "#5A5A5A",
    marginBottom: "8px",
    letterSpacing: "2px",
  },

  footerDate: {
    fontSize: "12px",
    color: "#999",
    marginBottom: "24px",
  },

  footerCopyright: {
    fontSize: "11px",
    color: "#BBB",
  },

  // 토스트
  toast: {
    position: "fixed",
    bottom: "100px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 24px",
    backgroundColor: "rgba(0,0,0,0.8)",
    color: "#FFF",
    borderRadius: "25px",
    fontSize: "13px",
    zIndex: 1001,
    animation: "fadeInUp 0.3s ease-out",
  },
};

// CSS 애니메이션 추가
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600&family=Cormorant+Garamond:wght@300;400;500&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  ::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(styleSheet);

export default WeddingInvitation;
