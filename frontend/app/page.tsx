import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero";
import Footer from "@/components/Footer";
import Solutions from "@/components/solutions";
import Partners from "@/components/Clients";
export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection/>
      <Solutions/>
      <Partners/>
      <Footer/>
     
    </>
  );
}