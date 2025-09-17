
// async & await 외부 API 키를 불러오기 위해 사용한다
export default async function page({params}: {params : {slug : string}}){
    const {slug} = await params;
    return(
        <>
            <h1>This is blog page</h1>
        </>
    )
}