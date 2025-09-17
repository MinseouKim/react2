# 202130103 김민서
## 9/17 4주차
### git checkout vs git switch 차이
- checkout은 브렌치를 이동하고 파일도 바꿀 수 있습니다. 이 때문에 실수할 위험성이 있습니다.
- switch 브랜치만 이동할 수 있기 때문에 안전하게 사용할 수 있다.
### 새 branch를 만드느느 명령어
- 또한 switch와 checkout은 branch를 만들기만 할 수는 없고, 만들고 바로 이동합니다.
- $ git switch -c \<branch name\>
- $ git checkout -b \<branch name\>
- $ git checkout \<branch name\>

## Next.js 3장 시작
- 레이아웃은 여러 페이지에서 공유 되는 UI입니다 . 탐색 시 레이아웃은 상태를 유지하고, 상호작용을 유지하며, 다시 렌더링되지 않습니다.

- layout기본적으로 React 컴포넌트를 파일 에서 내보내 레이아웃을 정의할 수 있습니다 . 
- 컴포넌트는 children페이지 또는 다른 레이아웃이 될 수 있는 prop을 받아야 합니다 .

- 예를 들어, 인덱스 페이지를 자식으로 허용하는 레이아웃을 만들려면 다음 디렉토리 layout에 파일을 추가합니다 (app).

### app/layout.tsx
```
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```
- 위 레이아웃은 디렉토리 루트에 정의되어 있으므로 **Root layout/app** 이라고 합니다 . 루트 레이아웃은 필수이며 **html** 및 **body** 태그를 포함해야 합니다 .

- 중첩 경로는 여러 URL 세그먼트로 구성된 경로입니다. 예를 들어, /blog/[slug]경로는 세 개의 세그먼트로 구성됩니다.

- /(루트 세그먼트)
- blog(세그먼트)
- [slug](잎 세그먼트)

### 동작 세그먼트 만들기
- 동적 세그먼트를 생성하려면 세그먼트(폴더) 이름을 대괄호로 묶습니다(예: [segmentName].). 예를 들어, app/blog/[slug]/page.tsx경로에서 는 [slug]동적 세그먼트입니다.
- Dynamic Segments 내의 중첩된 레이아웃 도 paramsprops에 액세스할 수 있습니다.

### 검색 매개변수를 사용한 랜더링
- 서버 구성 요소 페이지 에서 다음 prop(searchParams)을 사용하여 검색 매개변수에 액세스할 수 있습니다. 

```
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```
- 검색 매개변수를 읽기 위한 수신 요청이 필요하므로 searchParams페이지를 동적 렌더링 으로 선택 합니다.

- 클라이언트 구성 요소는 useSearchParams : 후크를 사용하여 검색 매개변수를 읽을 수 있습니다.

- useSearchParams: 정적 으로 렌더링된 경로 와 동적으로 렌더링된 경로 에 대해 자세히 알아보세요 .


## 9/10 3주차
### 용어 정의
- 원문에는 route 라는 단어가 자주 등장하고, 사전적 의미로는 "경로"입니다.
- route는 "경로"를 의미하고, routing은 "경로를 찾아가는 과정"을 의미합니다.
- 그런데 path도 "경로"로 변역하기 때문에 구별을 위해 대부분 routing으로 변역했습니다.

- directory와 folder는 특별한 구분 없이 나옵니다.
- 최상위 폴더의 경우 directory로 하위 폴더는 folder로 쓰는 경우가 많지만 꼭 그렇지는 않습니다.
- directory와 folder는 OS에 따라 구분되는 용어이기 때문에 같은 의미로 이해하면 됩니다.
- segment는 routing과 관련이 있는 directory의 별칭 정도로 이해하면 됩니다.

### 1. Folder and file conventions
[라우팅 파일]
- layout
- Page
- loading
- not-found(UI를 찾을 수 없습니다)
- error(오류UI)
- global-error(글로벌 오류UI)
- route(API 엔드 포인트)
- template(다시 렌더링된 레이아웃)
- default(병렬 라우팅 대체 페이지)
[중첩 라우팅]
- folder 라우팅 세그먼트
- folder/folder 중첩된 라우팅 세그먼트
### layout과 template의 차이
- 
### 2. Organizing your Project(프로젝트 구성하기)
- Next.js는 프로젝트 파일을 어떻게 구성하고 어디에 배치할지에 대한 제약이 없습니다.

- component는 중첩된 라우팅에서 재귀적으로 랜더링됩니다.
- 즉 라우팅 세그먼트의 component는 부모 세그먼트의 component 내부에 중첩됩니다.
[참고 이미지 출처 : Next.js](image.png)

[코로케이션] - 파일 및 폴더를 기능별로 그룹화
- app 디렉토리에서 중첩된 폴더는 라우팅 구조를 정의
- 각 폴더는 URL 경로의 해당 세그먼트에 맵핑되는 라우팅 세그먼트를 나타냄

- 알아두면 좋아요 
    - 프로젝트 파일을 app 폴더에 함꼐 저장할 수는 있지만 꼭 그럴 필요는 없습니다. 원한다면 app 디렉토리 외부에 보관할 수도 있습니다.

- app 디렉토리의 파일은 기본적으로 안전하게 코로케이션 될 수 있으므로, 코로케이션에 비공개 폴더는 불필요 합니다. 하지만 다음과 같은 경우에는 유용할 수 있습니다.
- UI 로직과 라우팅 로직을 분리
- 내부 파일을 일관되게 구성
- 파일을 정렬하고 그룹화 가능
- 잠재적인 이름 충돌을 방지

- 알아두면 좋은 정보
- 밑줄 패턴을 사용하여 비공개 폴더 외부의 파일을 "비공개"로 표시

### [라우팅 그룹]
- 폴더를 괄호로 묶어 라우팅 그룹을 만들 수 있습니다.
- 구성 목적으로 사용되는 것을 의미, 라우터의 URL 경로에 포함되지 않아야함

#src/ 디렉토리
- 모든 소스 코드는 src에 들어가 있어야한다.

## 9/3 2주차
### 자동 생성 되는 항목
- TypeScript (사용) : tsconfig.json 파일 생성
- Tailwind CSS 사용(선택)
- Tubopack 사용(선택)
- import alias 사용 (선택) : tsconfig.json에 "paths" 자동 생성
- 수동으로 프로젝트를 생성할 때 추가적으로 해야하는 작업을 자동으로 처리해 줍니다.

### 실습에 사용할 프로젝트를 생성
- 공식 문서에는 기본 패키지 관리자를 pnpm을 사용합니다.
- 원하는 패키지 관리자 탭을 클릭하면 명령을 확인할 수 있숩니다.

- 사이트 색션, 목적 또는 팀별로 라우트 구성

[src directory]
- 옵션으로 선택하는 src 폴더 내에 저장
- 이를 통해 애플리케이션 코드와 프로젝트 설정 파일을 분리할 수 있습니다.

## 설치 

### 빠른 시작
- Next.js라는 이름의 새 앱을 만듭니다.my-app
- cd my-app개발 서버를 시작합니다.
- 방문하다 http://localhost:3000.

### CLI로 생성
- 새로운 Next.js 앱을 만드는 가장 빠른 방법은 create-next-app모든 것이 자동으로 설정되는 를 사용하는 것입니다. 프로젝트를 만들려면 다음을 실행하세요.

### Hard link vs Symbolic link
- Hard Link
    - 디렉토리 엔트리에 매핑정보가 추가
    - 원본과 하드링크는 완전히 동일한 파일
    - 원본과 사본의 개념이 아닙니다.
    
- Symbolic link 
    - inode를 공유하지 않고 경로 문자열을 저장해 두는 특수 파일
    - 심볼릭 링크를 열면 내부에 적힌 "경로"를 따라가서 원본 파일을 찾는다.
    - 원본이 삭제되면 심볼릭 링크는 끊어진 경로가 되므로 더 이산 사용할 수 없습니다.
    - 윈도우의 바로 가기

## 8/27 1주차
## OT & TypeScript
### 수업 자료 : Next.js 공식문서
