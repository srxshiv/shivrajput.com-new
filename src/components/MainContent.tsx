import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Services } from "@/components/Services";
import Footer from "@/components/Footer";
import { GlassmorphicBackdrop } from "./GlassBack";

export const MainContent = () => {
    return (
        // CRITICAL FIX: Added 'relative', 'z-20', and 'overflow-hidden'.
        // This traps the absolute background inside this wrapper and sits it on top of the Hero.
        // Added 'rounded-t-[3rem]' so it looks like a sleek card sliding over your Hero.
        <div className="relative z-20 overflow-hidden rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            
            {/* The backdrop is now perfectly contained inside this block */}
            <GlassmorphicBackdrop />
            
            {/* Because the background is absolute, your content needs to be relative z-10 
              so it sits on top of the glass, not underneath it.
            */}
            <div className="relative z-10">
                <Services />
                <ProjectsSection />
                <ExperienceSection />
                <ContactSection />
                <Footer />
            </div>
            
        </div>
    );
};