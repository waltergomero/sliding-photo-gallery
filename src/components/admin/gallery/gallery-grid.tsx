'use client';

import React, {useState, useEffect} from 'react';
import {DeleteImageBtn,  EditImageBtn} from './buttons';
import {fetchImages, fetchImagesByCategory, fetchCategoriesWithImages, UpdateImageInformation } from "@/actions/gallery-actions";
import {Button, Modal} from "react-bootstrap";
import { fr } from 'zod/v4/locales';

interface GalleryGridProps {
  category_name?: string;
}

const GalleryGrid = ({category_name}: GalleryGridProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<any>(null);
  const [newCaption, setNewCaption] = useState("");

  const _category_name = category_name ? category_name : "All";

  // Handler to open modal for editing caption
  const handleEditClick = (image: any) => {
    setModalImage(image);
    setNewCaption(image.caption);
    setShowModal(true);
  };

  // Handler to update caption (stub, replace with actual update logic)
  const handleUpdateCaption = async (id: string, caption: string) => {
    // Create FormData and append required fields
    const formData = new FormData();
    formData.append("image_id", id);
    formData.append("caption", caption);
    await UpdateImageInformation(formData);
    setShowModal(false);
    // Reload images after update
    const imagesData = await fetchImages(selectedCategory);
    setImages(imagesData);
  };



  // Initialize selectedCategory when component mounts or category_name prop changes
  useEffect(() => {
    setSelectedCategory(_category_name.toLowerCase());
  }, [_category_name]);

  useEffect(() => {
    // Fetch categories with images
    const loadCategories = async () => {
      const categoriesData = await fetchCategoriesWithImages();
      setCategories(categoriesData);
    };

    const loadImages = async () => {
      const imagesData = await fetchImages(_category_name);
      setImages(imagesData);
    };

    loadCategories();
    loadImages();
  }, [_category_name]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const dropdownName = e.target.options[e.target.selectedIndex].text;
    setSelectedCategory(selectedValue);
    const imagesData = await fetchImages(dropdownName);
    setImages(imagesData);
  };

  return (
    <div>
       <div className="mb-3 col-md-2">
          <select
            name="category_id"
            onChange={handleChange}
            value={selectedCategory}
            className="form-select">
            {categories.map((category:any) => (
                <option key={category.categoryId} value={category.category_name.toLowerCase()}>
                    {category.category_name}
                </option>
            ))}
          </select>
       </div>
      <div className="row">
          {images && images?.map((item:any) =>(          
        <div className="col-md-2" key={item.id}>
          <div className="thumbnail border p-2 mb-3">
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1.2',
                overflow: 'hidden',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
            <DeleteImageBtn image_id={item.id} image_src={item.src}/>
            <EditImageBtn id={item.id} onClick={() => handleEditClick(item)}/>
              <img
                className="img-fluid"
                src={item.src}
                alt={item.caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}              
              />
            </div>
            <div>
              {item.caption}
            </div>
          </div>
        </div>
        ))
        }
    {/* Modal for editing caption */}
    {showModal && modalImage && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Image Caption</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <img src={modalImage.src} alt={modalImage.caption} style={{ width: '40%', marginBottom: 12 }} />
          </div>
          <input
             type="text"
             value={newCaption}
             onChange={e => setNewCaption(e.target.value)}
             className="form-control mb-2"  />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" className="btn-sm" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <form
            className="d-inline"
            onSubmit={async (e) => {
              e.preventDefault();
              if (modalImage) {
                await handleUpdateCaption(modalImage.id, newCaption);
              }
            }}
          >
            <Button variant="primary" className="btn-sm" type="submit">
              Save
            </Button>
          </form>
        </Modal.Footer>
      </Modal>
    )}
    </div>
    </div>
  )
}

export default GalleryGrid