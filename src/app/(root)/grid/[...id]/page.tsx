import React, { Fragment } from 'react';
import Link from 'next/link';
import { fetchImagesByCategory } from '@/actions/gallery-actions';
import GalleryPageScripts from './GalleryPageScripts';
import '@/assets/gallery/css/custom.css';
import '@/assets/gallery/css/equal-height-fix.css';
import '@/assets/gallery/css/jquery.fancybox.min.css';

const GridImagesPage = async ({params}: any) => {
    const _params = await params;
    const categoryName = _params.id ? decodeURIComponent(_params.id[0]) : 'All';
    const images = await fetchImagesByCategory(categoryName);
    return (
     <Fragment>
    <div className="page-header container-fluid p-0">
		<div className="row m-0 align-items-center justify-content-center bg-dark">
		    <img src="/images/header-placeholder-min.png" alt="Header Placeholder"/>
		    <h1 className="h1 position-absolute single-category-title">Category<small>{categoryName}</small></h1>
		</div>
	  </div>
      <div className='pb-1'>
        <div className="container gallery-wrap mt-sm-5">
          <div className="row artist-gallery-images">
            {images && images?.map((item: any, index: number) =>(          
              <div key={index} className="col-sm-3">
                <div className="photo-box position-relative">
                    <a className="position-absolute enlarge-photo" 
                       data-id="20389751" 
                       href="#" 
                       data-artist={item.caption} 
                       data-url={item.src}>
                    <img src="/images/magnifier-min.png"/></a>
                    <div style={{background: `url('${item.src}') no-repeat center center`, backgroundSize: 'contain', backgroundColor: '#000'}}>
                      <img style={{opacity: 0}} src={item.src} width="788" height="526"/>
                    </div>
                </div>
                </div>	        	            
            ))}
          </div>
          </div>
          </div>
          
      {/* Full Screen Slider Modal */}
      <div className="fscreen-slider-wrapper">
          <div className="fscreen-slider-close"></div>
          <div className="fscreen-slider"></div>
          <div className="fscreen-page-nav" data-page="1">
              <div className="fscreen-page-arrow fscreen-prev-page"></div>
              <div className="fscreen-page-arrow fscreen-next-page"></div>
          </div>
      </div>
      
      <GalleryPageScripts />
    </Fragment>
  )
}

export default GridImagesPage