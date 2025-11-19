# 202130103 김민서
# 11/19 14주차
# CSS
## 테일윈드 CSS
#### Tailwind CSS 설치:
````ruby
pnpm add -D tailwindcss @tailwindcss/postcss
````
- PostCSS 플러인 추가
````ruby
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
````
- 글로벌 CSS 파일에 Tailwind를 가져옵니다.
````ruby
@import 'tailwindcss';
````
- 루트 레이아웃에 CSS 파일을 가져옵니다.
````ruby
import './globals.css'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
````
- Tailwind Utlity Class 사용가능
````ruby
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
````
### CSS 모듈
- CSS 모듈은 고유한 클래스 이름을 생성하여 CSS의 로컬 범위를 지정합니다. 이를 통해 이름 충돌 걱정 없이 여러 파일에서 동일한 클래스를 사용할 수 있습니다.
````ruby
.blog {
  padding: 24px;
}
````
````ruby
import styles from './blog.module.css'
 
export default function Page() {
  return <main className={styles.blog}></main>
}
````
### 글로벌 CSS
- 글로벌 CSS를 사용하면 애플리케이션 전체에 스타일을 적용할 수 있습니다.
````ruby
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
````
````ruby
// These styles apply to every route in the application
import './global.css'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
````
### 외부 스타일시트
- 외부 패키지에서 게시된 스타일시트는 공동 배치된 구성 요소를 포함하여 디렉토리의 어느 곳으로나 가져올 수 있습니다.
````ruby
import 'bootstrap/dist/css/bootstrap.css'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
````
# 11/12 13주차
## Caching and Revalidating
- 캐싱은 데이터 페치 및 기타 계산 결과를 저장하여 향후 동일한 데이터에 대한 요청을 더 빠르게 처리할 수 있도록 하는 기술입니다. 

#### Next.js는 캐싱 및 재검증 처리를 위한 몇 가지 API를 제공합니다. 이 가이드에서는 이러한 API를 언제, 어떻게 사용하는지 안내합니다.
- fetch
- cacheTag
- revalidateTag
- updateTag
- revalidatePath
- unstable_cache

### fetch
````ruby
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
````
### cacheTag
- use cache캐시 구성 요소를 사용하면 지시어를 사용하여 모든 계산을 캐시하고 태그를 지정할 수 있습니다.
````ruby
import { cacheTag } from 'next/cache'
 
export async function getProducts() {
  'use cache'
  cacheTag('products')
 
  const products = await db.query('SELECT * FROM products')
  return products
}
````
### revalidateTag
- revalidateTag태그와 이벤트 발생 후 캐시 항목을 다시 검증하는 데 사용됩니다
- 사용profile="max" : 오래된 콘텐츠를 제공하는 동안 재검증하는 동안 오래된 콘텐츠 의미론을 사용하여 백그라운드에서 새 콘텐츠를 가져옵니다.
- 두 번째 인수가 없는 경우 : 캐시를 즉시 만료하는 레거시 동작(더 이상 사용되지 않음)
````ruby
import { revalidateTag } from 'next/cache'
 
export async function updateUser(id: string) {
  // Mutate data
  revalidateTag('user', 'max') // Recommended: Uses stale-while-revalidate
}
````
### UpdateTag
- updateTag는 서버 작업에서 직접 읽고 쓰는 시나리오에서 캐시된 데이터를 즉시 만료하도록 특별히 설계되었습니다. 
````ruby
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
 
export async function createPost(formData: FormData) {
  // Create post in database
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })
 
  // Immediately expire cache so the new post is visible
  updateTag('posts')
  updateTag(`post-${post.id}`)
 
  redirect(`/posts/${post.id}`)
}
````
### revalidatePath
- revalidatePath는 경로의 유효성을 재검사하고 이벤트 발생 시 사용하는 함수입니다. 사용하려면 경로 핸들러 또는 서버 작업에서 호출합니다.
````ruby
import { revalidatePath } from 'next/cache'
 
export async function updateUser(id: string) {
  // Mutate data
  revalidatePath('/profile')
````
### unstable_cache
- unstable_cache데이터베이스 쿼리 및 기타 비동기 함수의 결과를 캐시할 수 있습니다. 

````ruby
import { db } from '@/lib/db'
export async function getUserById(id: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((res) => res[0])
}
````

# 11/05 12주차
## Updating Data
### 서버 기능이란 무엇인가요?
- 서버 함수 는 서버에서 실행되는 비동기 함수입니다. 네트워크 요청을 통해 클라이언트에서 호출될 수 있으므로 비동기적이어야 합니다.

- 또는 변형 컨텍스트 에서는 이를 서버 작업action 이라고도 합니다 .
### 서버 함수 생성
- 서버 기능은 다음을 사용하여 정의할 수 있습니다.use server, 지시어 비동기 함수 의 맨 위에 지시어를 배치하여 해당 함수를 서버 함수로 표시하거나, 별도 파일의 맨 위에 지시어를 배치하여 해당 파일의 모든 내보내기를 표시할 수 있습니다.
````ruby
export async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  const content = formData.get('content')
 
  // Update data
  // Revalidate cache
}
 
export async function deletePost(formData: FormData) {
  'use server'
  const id = formData.get('id')
 
  // Update data
  // Revalidate cache
}
````
### 클라이언트 구성 요소
- 클라이언트 구성 요소에서는 서버 함수를 정의할 수 없습니다. 하지만 "use server"맨 위에 다음 지시어가 있는 파일에서 서버 함수를 가져와 클라이언트 구성 요소에서 호출할 수 있습니다.
````ruby
'use server'
 
export async function createPost() {}
-----------------------------------------
'use client'
 
import { createPost } from '@/app/actions'
 
export function Button() {
  return <button formAction={createPost}>Create</button>
}
````
### 액션을 소품으로 전달하기
````ruby
'use client'
 
export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
````
### 이벤트 핸들러
- . 과 같은 이벤트 핸들러를 사용하여 클라이언트 구성 요소에서 서버 함수를 호출할 수 있습니다 (onClick)
````ruby
'use client'
 
import { incrementLike } from './actions'
import { useState } from 'react'
 
export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
 
  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
````
### 보류 상태 표시
````ruby
'use client'
 
import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'
 
export function Button() {
  const [state, action, pending] = useActionState(createPost, false)
 
  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
````
### 쿠키
- API를 사용하여 서버 작업 내에서 쿠키를 사용할 get수 있습니다 (setdeletecookies)

- 서버 작업에서 쿠키를 설정하거나 삭제 하면 Next.js는 서버에서 현재 페이지와 레이아웃을 다시 렌더링하여 UI 가 새로운 쿠키 값을 반영하도록 합니다.
````ruby
'use server'
 
import { cookies } from 'next/headers'
 
export async function exampleAction() {
  const cookieStore = await cookies()
 
  // Get cookie
  cookieStore.get('name')?.value
 
  // Set cookie
  cookieStore.set('name', 'Delba')
 
  // Delete cookie
  cookieStore.delete('name')
}
````
# 10/30 11주차
## Fetching Data
### 서버 구성 요소
다음을 사용하여 서버 구성 요소에서 데이터를 가져올 수 있습니다.
1. APIfetch​
2. ORM 또는 데이터베이스

### 중복된 요청 제거 및 데이터 캐시
- 요청 중복을 제거하는 한 가지 방법은 요청 메모이제이션fetch 입니다 . 이 메커니즘을 사용하면 단일 렌더 패스에서 동일한 URL과 옵션을 가진 또는 를 사용하는 호출이 하나의 요청으로 결합됩니다. 이 작업은 자동으로 수행되며, 에 Abort 신호를 전달하여 요청을 취소 할 수 있습니다 .
- fetchGETHEADfetch 요청 메모이제이션은 요청의 수명에 따라 범위가 지정됩니다.

- Next.js의 데이터 캐시를fetch 사용하여 요청 중복을 제거할 수도 있습니다 . 예를 들어 옵션 에서 다음과 같이 설정할 수 있습니다 .cache: 'force-cache'fetch
데이터 캐시를 사용하면 현재 렌더 패스와 들어오는 요청에서 데이터를 공유할 수 있습니다.

fetch를 사용 하지 않고 대신 ORM이나 데이터베이스를 직접 사용하는 경우 React 로 데이터 액세스를 래핑할 수 있습니다.cache기능.

````ruby
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'
 
export const getPost = cache(async (id: string) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
})
````
### Streaming
- 서버 구성 요소에서 데이터를 가져오면 각 요청마다 서버에서 데이터를 가져와 렌더링합니다. 데이터 요청 속도가 느리면 모든 데이터를 가져올 때까지 전체 경로의 렌더링이 차단됩니다.

#### 스트리밍 구현 방법
- 파일 로 페이지 래핑 loading.js
- 구성 요소를 래핑하는 방법<Suspense>

````ruby
export default function Loading() {
  // Define the Loading UI here
  return <div>Loading...</div>
}
````
#### With <Suspense>
- <Suspense>페이지의 어떤 부분을 스트리밍할지 더욱 세부적으로 설정할 수 있습니다. 예를 들어, 경계를 벗어나는 모든 페이지 콘텐츠를 즉시 표시하고 <Suspense>, 경계 안에 있는 블로그 게시물 목록은 스트리밍할 수 있습니다.

````ruby
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'
 
export default function BlogPage() {
  return (
    <div>
      {/* This content will be sent to the client immediately */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* Any content wrapped in a <Suspense> boundary will be streamed */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
````
### Parallel data fetching
- 병렬 데이터 페치는 경로에서 데이터 요청이 적극적으로 시작되고 동시에 시작될 때 발생합니다.
- 기본적으로 레이아웃과 페이지는 병렬로 렌더링됩니다. 따라서 각 세그먼트는 가능한 한 빨리 데이터를 가져오기 시작합니다.
- 하지만 어떤 구성 요소 내에서든 여러 개의 async/ await요청이 다른 요청 뒤에 배치되는 경우 순차적일 수 있습니다. 예를 들어, is가 해결될 getAlbums때까지 차단됩니다 getArtist

````ruby
import { getArtist, getAlbums } from '@/app/lib/data'
 
export default async function Page({ params }) {
  // These requests will be sequential
  const { username } = await params
  const artist = await getArtist(username)
  const albums = await getAlbums(username)
  return <div>{artist.name}</div>
}
````

### 데이터 사전 로딩
- 요청을 차단하는 위에서 적극적으로 호출하는 유틸리티 함수를 만들어 데이터를 미리 로드할 수 있습니다. 함수 <Item>에 따라 조건부로 렌더링합니다 checkIsAvailable().

- 데이터 종속성을 즉시 시작하기 위해 preload()before를 호출할 수 있습니다 . 렌더링될 때쯤이면 데이터가 이미 페치된 상태입니다.checkIsAvailable()<Item/><Item/>

````ruby
import { getItem, checkIsAvailable } from '@/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // starting loading item data
  preload(id)
  // perform another asynchronous task
  const isAvailable = await checkIsAvailable()
 
  return isAvailable ? <Item id={id} /> : null
}
 
export const preload = (id: string) => {
  // void evaluates the given expression and returns undefined
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
  void getItem(id)
}
export async function Item({ id }: { id: string }) {
  const result = await getItem(id)
  // ...
}
````

# 10/29 10주차
## 캐시 구성 요소
- 캐시 구성 요소는 Next.js에서 렌더링 및 캐싱을 위한 새로운 접근 방식으로, 캐시되는 내용과 시기를 세부적으로 제어하는 ​​동시에 부분 사전 렌더링(PPR)을 통해 뛰어난 사용자 경험을 보장합니다 .



### 캐시 구성 요소
- 동적 애플리케이션을 개발할 때는 두 가지 주요 접근 방식의 균형을 맞춰야 합니다.

- 완전히 정적인 페이지는 빠르게 로드되지만 개인화된 데이터나 실시간 데이터를 표시할 수 없습니다.
- 완전히 동적인 페이지는 최신 데이터를 표시할 수 있지만 각 요청에서 모든 것을 렌더링해야 하므로 초기 로드 속도가 느려집니다.
- 캐시 구성 요소를 활성화하면 Next.js는 기본적으로 모든 경로를 동적 으로 처리합니다 . 모든 요청은 사용 가능한 최신 데이터로 렌더링됩니다. 그러나 대부분의 페이지는 정적 요소와 동적 요소로 구성되므로 모든 요청에서 모든 동적 데이터를 소스에서 확인할 필요는 없습니다.

- 캐시 구성 요소를 사용하면 데이터와 UI의 일부까지 캐시 가능한 것으로 표시할 수 있으며, 페이지의 정적 부분과 함께 사전 렌더링 단계에 포함됩니다.

### 작동 원리
## 1. 런타임 데이터에 대한 서스펜스
일부 데이터는 실제 사용자가 요청할 때 런타임에만 사용할 수 있습니다. cookies, headers, 와 같은 API는 searchParams요청별 정보에 접근합니다. 이러한 API를 사용하여 구성 요소를 Suspense경계로 감싸면 나머지 페이지는 정적 셸로 미리 렌더링될 수 있습니다.

- 런타임 API는 다음과 같습니다.

- cookies
- headers
- searchParams소품
- paramsprop - .를 통해 하나 이상의 예시 값을 제공하지 않는 한 런타임 데이터입니다 
- generateStaticParams. 제공된 경우, 해당 매개변수 값은 사전 렌더링된 경로에 대해 정적으로 처리되지만 다른 값은 런타임 데이터로 유지됩니다.

## 2. 동적 데이터에 대한 서스펜스
fetch호출이나 데이터베이스 쿼리( ) 와 같은 동적 데이터는 db.query(...)요청 간에 변경될 수 있지만 사용자별로 달라지지는 않습니다. connectionAPI는 메타 동적입니다. 즉, 반환할 실제 데이터가 없더라도 사용자 탐색을 기다리는 것을 의미합니다. Suspense스트리밍을 활성화하려면 이러한 데이터를 사용하는 구성 요소를 경계로 래핑합니다.

## 3. 캐시된 데이터
모든 서버 구성 요소에 추가하여 use cache캐시하고 사전 렌더링된 셸에 포함합니다. 캐시된 구성 요소 내부에서는 런타임 API를 사용할 수 없습니다. 유틸리티 함수를 로 표시 use cache하고 서버 구성 요소에서 호출할 수도 있습니다.
````ruby
export async function getProducts() {
  'use cache'
  const data = await db.query('SELECT * FROM products')
  return data
}
````
## 서스펜스 경계 사용
- 리액트 서스펜스경계를 사용하면 동적 또는 런타임 데이터를 래핑할 때 사용할 대체 UI를 정의할 수 있습니다.

- 폴백 UI를 포함한 경계 외부의 콘텐츠는 정적 셸로 미리 렌더링되는 반면, 경계 내부의 콘텐츠는 준비가 되면 스트리밍됩니다.
````ruby
import { Suspense } from 'react'
 
export default function Page() {
  return (
    <>
      <h1>This will be pre-rendered</h1>
      <Suspense fallback={<Skeleton />}>
        <DynamicContent />
      </Suspense>
    </>
  )
}
 
async function DynamicContent() {
  const res = await fetch('http://api.cms.com/posts')
  const { posts } = await res.json()
  return <div>{/* ... */}</div>
}
````
# 10/22 9주차
## Interleaving Server and Client Components
- 서버 컴포넌트를 클라이언트 컴포넌트에 prop으로 전달할 수 있습니다. 이를 통해 클라이언트 컴포넌트 내에 서버에서 렌더링된 UI를 시각적으로 중첩할 수 있습니다.
- 일반적인 패턴은 . 에 슬롯을children 생성하는 것입니다 . 예를 들어, 클라이언트 상태를 사용하여 가시성을 전환하는 컴포넌트 내부에 서버에서 데이터를 가져오는 컴포넌트가 있습니다 .<ClientComponent><Cart><Modal>
```
'use client'
 
export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
-------------------------------------------------------

import Modal from './ui/modal'
import Cart from './ui/cart'
 
export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```
## 컨텍스트 제공자
- React 컨텍스트 현재 테마처럼 전역 상태를 공유하는 데 일반적으로 사용됩니다. 하지만 React 컨텍스트는 서버 컴포넌트에서 지원되지 않습니다.

## 타사 구성 요소
- 클라이언트 전용 기능에 의존하는 타사 구성 요소를 사용하는 경우, 해당 구성 요소를 클라이언트 구성 요소에 래핑하여 예상대로 작동하는지 확인할 수 있습니다.

- 예를 들어, 패키지 <Carousel />에서 를 가져올 수 있습니다 acme-carousel. 이 구성 요소는 를 사용 useState하지만 아직 지시어가 없습니다 "use client".

- <Carousel />클라이언트 구성 요소 내에서 사용하면 예상대로 작동합니다.
```
'use client'
 
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
 
export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)
 
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  )
}
```
- 도서관 저자를 위한 조언

- 컴포넌트 라이브러리를 빌드하는 경우, "use client"클라이언트 전용 기능에 의존하는 진입점에 지시문을 추가하세요. 이렇게 하면 사용자가 래퍼를 만들지 않고도 서버 컴포넌트로 컴포넌트를 가져올 수 있습니다.

- 일부 번들러는 지시어를 제거할 수 있다는 점에 유의하세요 . React Wrap Balancer 에서 지시어를 "use client"포함하도록 esbuild를 구성하는 방법의 예를 확인할 수 있습니다."use client"및 Vercel Analytics저장소.

## 환경 오염 예방
```
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```
- 이 기능에는 API_KEY클라이언트에 노출되어서는 안 되는 내용이 포함되어 있습니다.

- Next.js에서는 접두사가 붙은 환경 변수만 NEXT_PUBLIC_클라이언트 번들에 포함됩니다. 접두사가 붙지 않은 변수는 Next.js에서 빈 문자열로 대체됩니다.

- 결과적으로 getData()클라이언트에서 가져와서 실행할 수는 있지만 예상대로 작동하지 않습니다.

- 클라이언트 구성 요소에서 실수로 사용되는 것을 방지하려면 다음 server-only패키지를 사용할 수 있습니다.


# 10/17 8주차
## 서버 및 클라이언트 구성 요소
### 서버와 클라이언트 구성요소를 언제 사용해야 하나요?
다음과 같은 경우 클라이언트 구성 요소를 사용하세요 .
- 상태및 이벤트 핸들러. 예를 들어 onClick, onChange.
- 수명 주기 논리. 예를 들어 useEffect.
- 브라우저 전용 API. 예 localStorage: , window, Navigator.geolocation, 등
- 맞춤형 후크.

다음과 같은 경우 서버 구성 요소를 사용하세요 .
- 소스에 가까운 데이터베이스나 API에서 데이터를 가져옵니다.
- 클라이언트에게 노출하지 않고 API 키, 토큰 및 기타 비밀을 사용합니다.
- 브라우저로 전송되는 JavaScript의 양을 줄이세요.

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
### Next.js에서 서버와 클라이언트 구성 요소는 어떻게 작동합니까?
- 서버에서 Next.js는 React API를 사용하여 렌더링을 조정합니다

- HTML은 사용자에게 경로의 빠르고 비대화형 미리보기를 즉시 보여주는 데 사용됩니다.
- RSC 페이로드는 클라이언트와 서버 구성 요소 트리를 조정하는 데 사용됩니다.

- ex) 클라이언트 구성 요소 사용
```
'use client'
 
import { useState } from 'react'
 
export default function Counter() {
  const [count, setCount] = useState(0)
 
  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```
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
