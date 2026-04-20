import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero";
import Footer from "@/components/Footer";
import Solutions from "@/components/solutions";
import Partners from "@/components/Clients";
import Chatbot from "@/components/Chatbot";
export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection/>
       <Chatbot />  {/* ✅ ajoute ça à la fin */}
      <Solutions/>
      <Partners/>
      <Footer/>
     
    </>
  );
}