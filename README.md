# 202130103 김민서
# 10/1 6주차
### 클라이언트 측 전환
- 전통적으로 서버에서 렌더링된 페이지로 이동하면 전체 페이지가 로드됩니다. 이로 인해 상태가 삭제되고, 스크롤 위치가 재설정되며, 상호작용이 차단됩니다.

- Next.js는 컴포넌트를 사용하여 클라이언트 측 전환을 구현함으로써 이러한 문제를 해결합니다 <Link>. 페이지를 새로 고치는 대신, 다음과 같은 방법으로 콘텐츠를 동적으로 업데이트합니다.

- 공유된 레이아웃과 UI를 유지합니다.
- 현재 페이지를 미리 가져온 로딩 상태 또는 가능한 경우 새 페이지로 바꿉니다.

- 클라이언트 측 전환은 서버에서 렌더링된 앱을 클라이언트에서 렌더링된 앱처럼 느껴지게 하는 요소입니다. 또한 프리페칭 및 스트리밍 과 함께 사용하면 동적 경로에서도 빠른 전환이 가능합니다.
### 전환을 느리게 만드는 요인은 무엇일까요?
- Next.js 최적화를 통해 탐색 속도가 빨라지고 반응성이 향상됩니다. 
하지만 특정 조건에서는 전환 속도가 여전히 느릴 수 있습니다 . 몇 가지 일반적인 원인과 사용자 경험을 개선하는 방법은 다음과 같습니다.

#### 동적 경로 없음(loading.tsx)
- 동적 경로로 이동할 때 클라이언트는 결과를 표시하기 전에 서버의 응답을 기다려야 합니다. 이로 인해 사용자는 앱이 응답하지 않는다는 인상을 받을 수 있습니다.

- loading.tsx부분적 프리페칭을 활성화하고, 즉각적인 탐색을 트리거하고, 경로가 렌더링되는 동안 로딩 UI를 표시하려면 동적 경로에 추가하는 것이 좋습니다 .

### 느린 네트워크
- 네트워크가 느리거나 불안정한 경우, 사용자가 링크를 클릭하기 전에 프리페칭이 완료되지 않을 수 있습니다. 이는 정적 경로와 동적 경로 모두에 영향을 미칠 수 있습니다. 이 경우, loading.js폴백이 아직 프리페칭되지 않았기 때문에 즉시 나타나지 않을 수 있습니다.

- 인지된 성과를 개선하기 위해 전환이 진행되는 동안 사용자에게 인라인 시각적 피드백(링크의 스피너나 텍스트 반짝임 등)을 보여주기 위해 useLinkStatus후크 를 사용할 수 있습니다 .

### ex)네이티브 히스토리 API
- Next.js를 사용하면 네이티브를 사용할 수 있습니다.window.history.pushState그리고window.history.replaceState페이지를 다시 로드하지 않고도 브라우저의 기록 스택을 업데이트하는 방법.

- pushState그리고 replaceState호출은 Next.js 라우터에 통합되어 .와 동기화할 수 usePathname있습니다 useSearchParams.

- window.history.pushState
브라우저의 기록 스택에 새 항목을 추가하는 데 사용합니다. 사용자는 이전 상태로 돌아갈 수 있습니다. 예를 들어, 제품 목록을 정렬하려면 다음과 같이 합니다.

```
'use client'
 
import { useSearchParams } from 'next/navigation'
 
export default function SortProducts() {
  const searchParams = useSearchParams()
 
  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }
 
  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```
## 9/24 5주차

### searchParams란?

- URL의 쿼리 문자열을 읽는 방법

### 왜 "동적 렌더링"이 되는가?

- Next.js에서 페이지는 크게 정적 또는 동적으로 렌더링될 수 있다.
- searchParams는 요청이 들어와야만 값을 알 수 있기 때문에페이지를 정적으로 미리 생성할 수 없고, 요청이 올 떄마다 새로 렌더링 해야함

## 4장(Linking and Navigating)

### Introduction

- client-side transitions 기능이 기본 제공되어 네비게이션 속도가 빠르고 반응성이 뛰어납니다.
- 네비게이션이 작동하는 방식, 동적 라우트와 느린 네트워크에 맞게 네비게이션을 최적화하는 방법을 설명

### How navigation works

### 서버 렌더링

- Next.js에서 레이아웃과 페이지는 React 서버 구성 요소 입니다 .기본적으로. 초기 탐색 및 후속 탐색 시, 서버 구성 요소 페이로드는 클라이언트로 전송되기 전에 서버에서 생성됩니다.

- 서버 렌더링에는 발생 시점 에 따라 두 가지 유형이 있습니다 .

- 정적 렌더링(또는 사전 렌더링)은 빌드 시점이나 재검증 중에 발생하며 결과는 캐시됩니다.
- 동적 렌더링은 클라이언트 요청에 대한 응답으로 요청 시점에 발생합니다.
- 서버 렌더링의 단점은 클라이언트가 새 경로를 표시하기 전에 서버의 응답을 기다려야 한다는 것입니다. Next.js는 사용자가 방문할 가능성이 높은 경로를 미리 가져 오고 클라이언트 측 전환을 수행하여 이러한 지연을 해결합니다 .

### 프리페칭

- 프리페칭은 사용자가 해당 경로로 이동하기 전에 백그라운드에서 해당 경로를 로드하는 프로세스입니다. 이렇게 하면 애플리케이션에서 경로 간 이동이 즉각적으로 이루어지는 것처럼 느껴집니다. 사용자가 링크를 클릭할 때쯤이면 다음 경로를 렌더링하는 데 필요한 데이터가 클라이언트 측에 이미 준비되어 있기 때문입니다.

```
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog">Blog</Link>
          {/* No prefetching */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

### window.history.replaceState
- 브라우저 히스토리 스택의 현재 항목을 대체하는 데 사용합니다. 사용자는 이전 상태로 돌아갈 수 없습니다. 예를 들어, 애플리케이션의 로캘을 전환하려면 다음과 같이 합니다.
```
'use client'
 
import { usePathname } from 'next/navigation'
 
export function LocaleSwitcher() {
  const pathname = usePathname()
 
  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }
 
  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```



- 경로 중 얼마나 많은 부분이 미리 페치되는지는 경로가 정적이냐 동적이냐에 따라 달라집니다.

- 정적 경로 : 전체 경로가 미리 페치됩니다.
- 동적 경로 : 사전 페칭을 건너뛰거나 경로가 부분적으로 사전 페치되는 경우입니다 loading.tsx.
- Next.js는 동적 경로를 건너뛰거나 부분적으로 미리 가져오므로 사용자가 전혀 방문하지 않을 경로에 대한 불필요한 서버 작업을 방지합니다. 하지만 탐색 전에 서버 응답을 기다리면 사용자에게 앱이 응답하지 않는다는 인상을 줄 수 있습니다.

### 스트리밍

- 스트리밍을 사용하면 서버가 전체 경로가 렌더링될 때까지 기다리지 않고 동적 경로의 일부를 클라이언트에 준비되는 즉시 전송할 수 있습니다. 즉, 페이지의 일부가 아직 로드 중이더라도 사용자는 더 빨리 콘텐츠를 볼 수 있습니다.
- 동적 경로의 경우, 부분적으로 미리 가져올 수 있습니다 . 즉, 공유 레이아웃과 로딩 스켈레톤을 미리 요청할 수 있습니다.

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
