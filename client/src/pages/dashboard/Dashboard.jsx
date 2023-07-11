import { useNavigate, Link } from "react-router-dom";
import useLogout from "@/hooks/useLogout"; 
import useAuth from "@/hooks/useAuth";
import { usePosts } from "../../hooks/apiCalls/usePosts";

const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const { auth } = useAuth();
    const { posts, getPosts } = usePosts();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <section>
            <h1>Dashboard</h1>
            <br />
            <p>You are logged in!</p>

            {/* {console.log(posts)} */}

            { posts.length > 0 ? posts.map(post => {
                return (
                <div
                    key={ post._id }
                    className=""
                >
                    <div className="">
                        { post.body }
                    </div>
                </div>
                
            )}) : 'No posts found'}

            <br />
            <a href="/test">Go to the Test page</a>
            {/* <Link to="/test">Go to the Test page</Link> */}
            <br />

            {auth?.roles}

            {/* {auth?.roles == ['level1', 'level2', 'level3'] ? 'Hi' : 'Lo'} */}
            {auth?.roles == 'level2' && 'Business Account'}
            <br />
            {/* <Link to="/editor">Go to the Editor page</Link> */}
            <br />
            {/* <Link to="/admin">Go to the Admin page</Link> */}
            <br />
            {/* <Link to="/lounge">Go to the Lounge</Link> */}
            <br />
            {/* <Link to="/linkpage">Go to the link page</Link> */}
            <div className="flexGrow">
                <button onClick={signOut}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home
