import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
const LandingComponent = () => {
 
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn();
      console.log("Sign in result:", user);

      // if (user.uid) {
      //   console.error("No user ID found after sign in");
      //   return;
      // }
      if (user != null) {
        const userId = user.uid;
        console.log("Checking user existence for:", userId);

        const response = await fetch(`/api/user?userId=${userId}`);
        const data = await response.json();
        console.log("User check response:", data);

        if (data.exists) {
          console.log("User exists, routing to /article");
          await router.push("/article");
        } else {
          console.log("New user, routing to /select");
          await router.push("/select");
        }
      }
    } catch (error) {
      console.error("Sign in flow error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <section className="relative pt-12 overflow-hidden bg-black sm:pt-16">
        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-5xl font-normal tracking-widest uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                {" "}
                BitByBit{" "}
              </span>
            </p>
            <h1 className="mt-8 text-4xl font-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Read, code, repeat – because great developers grow one article at
              a time.
            </h1>

            <div className="flex flex-col items-center justify-center px-8 mt-12 space-y-5 sm:space-y-0 sm:px-0 sm:space-x-5 sm:flex-row">
              <div className="relative inline-flex items-center justify-center w-full sm:w-auto group">
                <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                <button
                  onClick={handleSignIn}
                  className="relative inline-flex items-center gap-3 justify-center w-full px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full sm:w-auto"
                >
                  {loading ? (
                    "Loading"
                  ) : (
                    <>
                      <Image
                        src="svgs/google.svg"
                        alt="Google Icon"
                        width={23}
                        height={22}
                        style={{ paddingRight: 5 }}
                      />
                      Start Now
                    </>
                  )}
                  {/* <Image
                    src="svgs/google.svg"
                    alt="Google Icon"
                    width={23}
                    height={22}
                    style={{ paddingRight: 5 }}
                  />
                  Start Now */}
                </button>
              </div>

              {/* <a href="#" title="" className="inline-flex items-center justify-center w-full px-8 py-3 text-base font-normal text-white transition-all duration-200 bg-black border border-gray-600 rounded-full sm:w-auto hover:border-white" role="button"> Talk to Sales </a> */}
            </div>
          </div>

          <div className="relative mt-12 -mb-4 sm:-mb-10 lg:-mb-12 sm:mt-16 lg:mt-24">
            <div className="absolute top-0 transform -translate-x-1/2 left-1/2">
              <svg
                className="blur-3xl filter"
                style={{ filter: "blur(64px)" }}
                width="645"
                height="413"
                viewBox="0 0 645 413"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M181.316 218.778C86.2529 123.715 -63.7045 134.94 31.3589 39.8762C126.422 -55.1873 528.427 41.1918 623.49 136.255C718.554 231.319 470.678 289.068 375.614 384.131C280.551 479.195 276.38 313.842 181.316 218.778Z"
                  fill="url(#d)"
                />
                {/* <defs>
                  <linearGradient id="d" x1="665.741" y1="178.506" x2="296.286" y2="474.62" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" style={{ stopColor: 'var(--color-cyan-500)' }} />
                                        <stop offset="100%" style={{ stopColor: 'var(--color-purple-500)' }} />
                                    </linearGradient>
                </defs> */}
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingComponent;
