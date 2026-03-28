import { SidebarContext } from "@/context/context";
import { useContext } from "react";

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    
    if (!context) {
        throw new Error('useSidebar must be used within a ThemeProvider');
    }
    
    return context;
}