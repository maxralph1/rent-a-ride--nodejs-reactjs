import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";
// import useLocalStorage from "@/hooks/useLocalStorage";
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

const useLogout = () => {
    const { setAuth } = useAuth();
    // let [persist] = useLocalStorage('persist', false);
    // let [user] = useLocalStorage('user', '');
    const axiosPrivate = useAxiosPrivate();

    const logout = async () => {
        // setAuth({});
        // persist = false;
        // user = '';
        try {
            setAuth({'': ''});

            const response = await axiosPrivate.post('/auth/logout', {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout