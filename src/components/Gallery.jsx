import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Image as ImageIcon } from 'lucide-react';
import { optimizeCloudinaryImage, shuffleImages } from '../utils/media';

const imagesPerPage = 20;
const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Gallery({ images }) {
  const [galleryImages] = useState(() => shuffleImages(images));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [page, setPage] = useState(1);
  const modalRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const touchStartRef = useRef(null);

  const isOpen = selectedIndex !== null;
  const selectedImage = selectedIndex === null ? null : galleryImages[selectedIndex];
  const previousImage = selectedIndex === null
    ? null
    : galleryImages[(selectedIndex - 1 + galleryImages.length) % galleryImages.length];
  const nextImage = selectedIndex === null
    ? null
    : galleryImages[(selectedIndex + 1) % galleryImages.length];
  const totalPages = Math.max(1, Math.ceil(galleryImages.length / imagesPerPage));
  const safePage = Math.min(page, totalPages);
  const visibleImages = galleryImages.slice(
    (safePage - 1) * imagesPerPage,
    safePage * imagesPerPage
  );

  const close = () => setSelectedIndex(null);
  const next = () =>
    setSelectedIndex((current) =>
      current === null ? 0 : (current + 1) % galleryImages.length
    );
  const previous = () =>
    setSelectedIndex((current) =>
      current === null
        ? galleryImages.length - 1
        : (current - 1 + galleryImages.length) % galleryImages.length
    );
  const goToPage = (nextPage) => setPage(Math.min(Math.max(nextPage, 1), totalPages));

  useEffect(() => {
    if (!selectedImage) return undefined;

    const preloads = [previousImage, nextImage].map((image) => {
      const preload = new Image();
      preload.src = optimizeCloudinaryImage(image.src, 1800);
      return preload;
    });

    return () => preloads.forEach((preload) => { preload.src = ''; });
  }, [nextImage, previousImage, selectedImage]);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => modalRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') previous();
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusable = [...modalRef.current.querySelectorAll(focusableSelector)];
      if (!focusable.length) {
        event.preventDefault();
        modalRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen]);

  const handleTouchStart = (event) => {
    touchStartRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartRef.current === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStartRef.current) - touchStartRef.current;
    touchStartRef.current = null;
    if (Math.abs(distance) < 50) return;
    if (distance < 0) next();
    else previous();
  };

  return (
    <>
      <section id="pictures" className="section gallery-section">
        <div className="section-heading">
          <p className="eyebrow">Pictures to Remember</p>
          <h2>Memories of Julius</h2>
          <p>Click any image for a full view.</p>
        </div>
        <div className="gallery-grid">
          {visibleImages.map((image, index) => {
            const imageIndex = (safePage - 1) * imagesPerPage + index;
            return (
              <button
                className="gallery-item"
                key={image.src}
                type="button"
                onClick={() => setSelectedIndex(imageIndex)}
              >
                <img
                  src={optimizeCloudinaryImage(image.src, 640)}
                  srcSet={`${optimizeCloudinaryImage(image.src, 360)} 360w, ${optimizeCloudinaryImage(image.src, 640)} 640w, ${optimizeCloudinaryImage(image.src, 960)} 960w`}
                  sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
                  alt={image.title}
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="640"
                  onError={(event) => {
                    const imageElement = event.currentTarget;
                    if (imageElement.src !== image.src) {
                      imageElement.removeAttribute('srcset');
                      imageElement.src = image.src;
                    }
                  }}
                />
                <span><ImageIcon size={16} />View Photo</span>
              </button>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="pagination" aria-label="Gallery pagination">
            <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
              Previous
            </button>
            <span>Page {safePage} of {totalPages}</span>
            <button type="button" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>
              Next
            </button>
          </div>
        )}
      </section>

      {selectedImage && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={selectedImage.title}>
          <button className="modal-backdrop" type="button" onClick={close} aria-label="Close photo viewer" />
          <div
            className="modal-content"
            ref={modalRef}
            tabIndex="-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button className="gallery-nav previous" type="button" onClick={previous} aria-label="Previous picture">
              <ChevronLeft size={26} />
            </button>
            <img
              src={optimizeCloudinaryImage(selectedImage.src, 1800)}
              srcSet={`${optimizeCloudinaryImage(selectedImage.src, 960)} 960w, ${optimizeCloudinaryImage(selectedImage.src, 1400)} 1400w, ${optimizeCloudinaryImage(selectedImage.src, 1800)} 1800w`}
              sizes="100vw"
              alt={selectedImage.title}
              onError={(event) => {
                const imageElement = event.currentTarget;
                if (imageElement.src !== selectedImage.src) {
                  imageElement.removeAttribute('srcset');
                  imageElement.src = selectedImage.src;
                }
              }}
            />
            <button className="gallery-nav next" type="button" onClick={next} aria-label="Next picture">
              <ChevronRight size={26} />
            </button>
            <div className="modal-actions">
              <div>
                <h3>Photo Memory</h3>
                <p>Picture {selectedIndex + 1} of {galleryImages.length}. {selectedImage.note}</p>
              </div>
              <a className="button secondary" href={selectedImage.src} download>
                <Download size={18} />Download
              </a>
              <button className="button primary" type="button" onClick={close}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
