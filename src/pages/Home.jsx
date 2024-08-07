
import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { gsap } from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Content from "../components/Content";
import LoadingAnimation from "../components/LoadingAnimation";

const Fahras = lazy(() => import("../components/Fahras"));
const Search = lazy(() => import("../components/Search"));

export default function Home() {
  const [isContentActive, setIsContentActive] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isBookmarkSaved, setIsBookmarkSaved] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFahrasVisible, setIsFahrasVisible] = useState(false);

  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const fahrasRef = useRef(null);
  const searchComponentRef = useRef(null);

  const toggleContent = useCallback(() => {
    setIsContentActive((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSearch = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleFahrasToggle = useCallback(() => {
    setIsFahrasVisible((prev) => !prev);
  }, []);

  const handleSurahClick = useCallback((startPage) => {
    setCurrentPage(startPage);
    setIsFahrasVisible(false);
  }, []);

  const hideFahras = useCallback(() => {
    setIsFahrasVisible(false);
  }, []);

  const toggleSearchVisibility = useCallback(() => {
    setIsSearchVisible((prev) => !prev);
  }, []);

  const hideSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  const handleSaveBookmark = useCallback(() => {
    localStorage.setItem("bookmark", currentPage);
    setIsBookmarkSaved(true);
    setTimeout(() => setIsBookmarkSaved(false), 2000);
  }, [currentPage]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });
    if (headerRef.current && footerRef.current) {
      tl.fromTo(
        headerRef.current,
        { right: "0" },
        { right: isContentActive ? "-100%" : "0" }
      )
      .fromTo(
        footerRef.current,
        { right: "0" },
        { right: isContentActive ? "-100%" : "0" },
        0 
      );
    }
  }, [isContentActive]);

  useEffect(() => {
    if (fahrasRef.current) {
      gsap.fromTo(
        fahrasRef.current,
        { left: "100%" },
        {
          left: isFahrasVisible ? "0" : "-100%",
          duration: 0.5,
          ease: "power2.inOut",
        }
      );
    }
  }, [isFahrasVisible]);

  useEffect(() => {
    if (searchComponentRef.current) {
      gsap.fromTo(
        searchComponentRef.current,
        { left: "100%" },
        {
          left: isSearchVisible ? "0" : "-100%",
          duration: 0.5,
          ease: "power2.inOut",
        }
      );
    }
  }, [isSearchVisible]);

  return (
    <>
      {isFahrasVisible && (
        <div className="w-full absolute h-full overflow-x-hidden">
          <div
            ref={fahrasRef}
            className="w-full h-full absolute left-[-100%] top-0 bg-white z-50 transition-all duration-500"
          >
            <Suspense fallback={<LoadingAnimation />}>
              <Fahras onSurahClick={handleSurahClick} onGoBack={hideFahras} />
            </Suspense>
          </div>
        </div>
      )}
      {isSearchVisible && (
        <div
          ref={searchComponentRef}
          className="w-full h-full absolute left-[-100%] top-0 bg-white z-50 transition-all duration-500"
        >
          <Suspense fallback={<LoadingAnimation />}>
            <Search onVerseClick={handlePageChange} onHide={hideSearch} />
          </Suspense>
        </div>
      )}
      <div className="w-[100%] h-[100vh] overflow-hidden absolute">
        <div
          ref={headerRef}
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100vh",
          }}
        >
          {!isBookmarkSaved && (
            <Header
              isContentActive={isContentActive}
              onPageSearch={handlePageSearch}
              onSaveBookmark={handleSaveBookmark}
              currentPage={currentPage}
              toggleFahrasVisibility={handleFahrasToggle}
              toggleSearchVisibility={toggleSearchVisibility}
            />
          )}
        </div>
      </div>
      <Content
        isContentActive={isContentActive}
        toggleContent={toggleContent}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        onPageSearch={handlePageSearch}
        onSaveBookmark={handleSaveBookmark}
      />
      <div className="w-[100%] h-[100vh] right-0 bottom-0 overflow-x-hidden absolute">
        <div
          ref={footerRef}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100vh",
          }}
        >
          {!isBookmarkSaved && (
            <Footer
              isContentActive={isContentActive}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}
