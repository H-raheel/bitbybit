import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";




const Header = () => {
  const router = useRouter();
  const { logOut } = useAuth();

    const handleLogout = async () => {
        try {
          await logOut();
          router.push('/');
        } catch (error) {
          console.error("Logout error:", error);
        }
      };
  return (
    <header className="py-4 bg-transparent shadow-lg z-20 backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
        <button
            onClick={handleLogout}
            className="hover:opacity-80 transition-opacity"
          >
             {/* <Image
              src="/imgs/progress.png"
              width={36}
              height={36}
              alt="Logout"
              priority
            /> */}
           
          </button>

          <button
            onClick={handleLogout}
            className="hover:opacity-80 transition-opacity"
          >
             <Image
              src="/imgs/logout.png"
              width={36}
              height={36}
              alt="Logout"
              priority
            />
           
          </button>
        
        </div>
      </div>
    </header>
  );
};

export default Header;