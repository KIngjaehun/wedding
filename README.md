# 💒 모바일 청첩장 설정 가이드

## 📁 파일 구조

```
wedding/
├── public/
│   └── index.html          ← 카카오 SDK 포함
├── src/
│   ├── App.js              ← 메인 앱
│   ├── firebase.js         ← Firebase 설정
│   └── WeddingInvitation.jsx  ← 청첩장 컴포넌트
└── package.json
```

---

## 🚀 설치 & 실행

```bash
# 1. 프로젝트 폴더로 이동
cd wedding

# 2. Firebase 설치
npm install firebase

# 3. 실행
npm start
```

---

## ✏️ 정보 수정하기

`WeddingInvitation.jsx` 파일 상단의 `WEDDING_CONFIG` 객체에서 수정:

```javascript
const WEDDING_CONFIG = {
  // 신랑 정보
  groom: {
    name: '김재훈',           // 신랑 이름
    father: '김정권',         // 아버지
    mother: '전미선',         // 어머니
    phone: '010-1234-5678',  // 전화번호
    account: { bank: '신한은행', number: '110-123-456789', holder: '김재훈' },
  },
  
  // 신부 정보
  bride: {
    name: '정예주',
    father: '정OO',
    mother: '박시원',
    phone: '010-8765-4321',
    account: { bank: '국민은행', number: '123-45-6789012', holder: '정예주' },
  },
  
  // 예식 정보
  wedding: {
    date: '2027-05-15',      // 형식: YYYY-MM-DD
    time: '13:00',           // 24시간제
    displayDate: '2027년 5월 15일 토요일 오후 1시',
    venue: '의정부 낙원웨딩홀',
    address: '경기도 의정부시 평화로 525',
  },
  
  // 갤러리 이미지 - URL 교체
  gallery: [
    'https://your-image-url-1.jpg',
    'https://your-image-url-2.jpg',
    // ... 추가 가능
  ],
};
```

---

## 🖼️ 갤러리 이미지 변경하기

### 방법 1: 외부 URL 사용
```javascript
gallery: [
  'https://example.com/photo1.jpg',
  'https://example.com/photo2.jpg',
],
```

### 방법 2: Firebase Storage 사용 (권장)

1. Firebase Console → Storage 이동
2. 이미지 파일 업로드
3. 업로드된 파일 클릭 → "액세스 토큰" 복사
4. URL을 gallery 배열에 추가

```javascript
gallery: [
  'https://firebasestorage.googleapis.com/v0/b/wedding-xxx.appspot.com/o/photo1.jpg?alt=media',
  'https://firebasestorage.googleapis.com/v0/b/wedding-xxx.appspot.com/o/photo2.jpg?alt=media',
],
```

### 방법 3: public 폴더 사용
```
public/
├── images/
│   ├── photo1.jpg
│   ├── photo2.jpg
```

```javascript
gallery: [
  '/images/photo1.jpg',
  '/images/photo2.jpg',
],
```

---

## 💬 카카오톡 공유 설정

1. https://developers.kakao.com 접속
2. 로그인 → "내 애플리케이션" → "애플리케이션 추가하기"
3. 앱 생성 후 "앱 키" → "JavaScript 키" 복사
4. `public/index.html`에서 수정:

```html
<script>
  Kakao.init('YOUR_JAVASCRIPT_KEY');  // 여기에 키 입력
</script>
```

5. "플랫폼" 설정 → "Web" 추가 → 배포할 도메인 등록
   - 예: `https://your-wedding.vercel.app`

---

## 📊 Firebase 콘솔에서 데이터 확인

### 방명록 확인
1. Firebase Console → Firestore Database
2. `guestbook` 컬렉션 클릭
3. 모든 방명록 메시지 확인 가능

### 참석 여부 확인
1. `attendance` 컬렉션 클릭
2. 참석자 명단, 인원수, 식사 여부 확인

### 데이터 내보내기
- Firebase Console에서 직접 확인하거나
- Export 기능으로 JSON/CSV 내보내기 가능

---

## 🌐 배포하기 (Vercel)

### 1. Vercel 가입
https://vercel.com 에서 GitHub 계정으로 가입

### 2. GitHub에 코드 올리기
```bash
git init
git add .
git commit -m "첫 커밋"
git remote add origin https://github.com/YOUR_USERNAME/wedding.git
git push -u origin main
```

### 3. Vercel에서 배포
1. Vercel 대시보드 → "New Project"
2. GitHub 저장소 선택
3. "Deploy" 클릭
4. 완료! URL 발급됨 (예: `https://wedding-xxx.vercel.app`)

### 4. 커스텀 도메인 연결 (선택)
- Vercel 프로젝트 → Settings → Domains
- 원하는 도메인 추가 (예: `wedding.mydomain.com`)

---

## 🔒 Firebase 보안 규칙 설정 (배포 전 필수!)

Firebase Console → Firestore → Rules 에서 수정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 방명록: 누구나 읽기/쓰기 가능
    match /guestbook/{document} {
      allow read: if true;
      allow create: if request.resource.data.name != null 
                    && request.resource.data.message != null;
      allow delete: if true;  // 비밀번호 체크는 클라이언트에서
    }
    
    // 참석 여부: 쓰기만 가능 (읽기는 관리자만)
    match /attendance/{document} {
      allow create: if request.resource.data.name != null;
      allow read: if false;  // 관리자는 Console에서 확인
    }
  }
}
```

---

## ❓ 자주 묻는 질문

### Q: 이미지가 안 보여요
- 이미지 URL이 HTTPS인지 확인
- CORS 문제일 수 있음 → Firebase Storage 사용 권장

### Q: 방명록이 저장 안 돼요
- Firebase Console에서 Firestore가 활성화되어 있는지 확인
- 보안 규칙이 "테스트 모드"인지 확인

### Q: 카카오 공유가 안 돼요
- JavaScript 키가 올바른지 확인
- 플랫폼에 도메인이 등록되어 있는지 확인

### Q: 무료로 사용 가능한가요?
- Firebase: 월 50,000 읽기/20,000 쓰기 무료 (청첩장에 충분)
- Vercel: 개인 프로젝트 무료
- 커스텀 도메인: 연 1~2만원

---

## 📞 문의

추가 기능이나 도움이 필요하면 언제든 물어보세요!
