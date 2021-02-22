import { useEffect } from "react";

export default function useDetectOutsideClick(ref, showDropdown, setShowDropdown) {
    // This useEffect will be attachment in Dashboard UI, being called when ref or showDropdown is changed.
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */

        // Verify if the ref and element existing, besides verify if dropdown is open (showed)
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && showDropdown) {
                //alert("You clicked outside of me!");
                setShowDropdown(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, showDropdown]);
}