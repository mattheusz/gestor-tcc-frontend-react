import { useEffect } from "react";

export default function useDetectOutsideClick(dropdownRef, avatarRef, showDropdown, setShowDropdown) {
    // This useEffect will be attachment in Dashboard UI, being called when ref or showDropdown is changed.
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */

        // Verify if the ref and element existing, besides verify if dropdown is open (showed)
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && showDropdown) {
                //alert("You clicked outside of me!");

                setShowDropdown(false);

            }
        }
        console.log(avatarRef.current)

        // Bind the event listener
        console.log('toggle dropdown HOOK', showDropdown)
        showDropdown && document.addEventListener("click", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickOutside);
        };
    }, [dropdownRef, showDropdown]);
}