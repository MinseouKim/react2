export default async function PostPage({
    params
}: {
    params : Promise<{id : string}>
}){
    const {id} = await params;

    const post = posts.find((p) => p.id === id);

    if(!post) {
        notFound();
    }

    return
    <div>
        <main>
            <p></p>
        </main>
    </div>
}