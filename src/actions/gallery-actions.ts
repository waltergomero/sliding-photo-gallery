'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '../../prisma/prisma';
const fs = require('fs');
import path from 'path';

export const fetchImages = async (category_name = "") => { 
  console.log("Fetching images for category: ", category_name);
    try {
      noStore(); // Disable caching for this function
      
       let _images;

       if (category_name === "All") {
        _images = await prisma.UserImages.findMany({});
      }
      else {
        _images = await prisma.UserImages.findMany({
          where: {
               AND: [
                {category_name: {
                  equals: category_name,
                  mode: 'insensitive'
                }},
              ]
          },
        });
      }
        const images = JSON.parse(JSON.stringify(_images));
        console.log("Fetched images: ", images);
        return images;
    } catch (err) {
        return({error: err + "Failed to fetch images!"});
    }
}

export const fetchImagesByCategory = async (category_name: string) => {
  try {
    //noStore(); // Disable caching for this function
    let _images = "";

      if(category_name === "All" || category_name === "0"){
          _images = await prisma.UserImages.findMany({
            where: {
              isactive: true // Only fetch active images
            },
            select: {
              id: true,
              src: true,
              caption: true,
              categoryId: true,
              category_name: true,
              width: true,
              height: true,
              format: true,
              isactive: true
            }
          })
      }
      else{
          _images = await prisma.UserImages.findMany({
            where: {
              AND: [
                {category_name: {
                  equals: category_name,
                  mode: 'insensitive'
                }},
                {isactive: true} // Only fetch active images
              ]
            },
            select: {
              id: true,
              src: true,
              caption: true,
              categoryId: true,
              category_name: true,
              width: true,
              height: true,
              format: true,
              isactive: true
            }
          }) 
      }
    const images = JSON.parse(JSON.stringify(_images));
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images by category! " + err});
  }
};

export async function deleteImageFromGallery(image_id: string, image_src: string) {
console.log("delete image from gallery: ", image_id, image_src);
  try {
    //await prisma.Homepagecategories.deleteMany({where: { src: image_src}});
    const response = await prisma.UserImages.delete({ where: {id: image_id}});
   console.log("response from delete: ", response);
    if(response){
      const imagePath = path.join(process.cwd(), 'public', image_src);
      console.log("image path: ", imagePath);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log("File deleted:", imagePath);
        } catch (err) {
          console.error("Failed to delete file:", err);
        }
      } else {
        console.log("File does not exist:", imagePath);
      }
    }
    
  } catch (err) {
    return({error: "Failed to delete image! " + err});
  }
  revalidatePath("/admin/gallery");
}


export async function fetchCategoriesWithImages() {
  try {
    //fetch distinct categories from UserImages collection
    const _categories = await prisma.UserImages.findMany({
      select: {
        categoryId: true,
        category_name: true
      },
      distinct: ['categoryId', 'category_name'],
      orderBy: {
        category_name: 'asc'
      }
    });
    const categories = JSON.parse(JSON.stringify(_categories));

    //add categoryId = 0 and category_name = "All" to the categories array
    categories.unshift({ categoryId: "0", category_name: "All" });
    
    return categories;
  } catch (err) {
    return({error: "Failed to fetch categories with images! " + err});
  }
}


export async function fetchOneImagePerCategory() {
  try {
    const _images = await prisma.UserImages.findMany({
      distinct: ['category_name'],
      select: {
        id: true,
        src: true,
        caption: true,
        category_name: true
      },
      orderBy: {
        category_name: 'asc',
      },
    });
    const images = JSON.parse(JSON.stringify(_images));
    return images;
  } catch (err) {
    return({error: "Failed to fetch one image per category! " + err});
  }
}

export async function fetchOneImagePerCategoryLimited() {
  try {
    const _images = await prisma.UserImages.findMany({
      distinct: ['category_name'],
      where: {
        format: 'landscape',
      },
      select: {
        id: true,
        src: true,
        caption: true,
        category_name: true
      },
      orderBy: {
        category_name: 'asc',
      },
      take: 8
    });
    const images = JSON.parse(JSON.stringify(_images));
    return images;
  } catch (err) {
    return({error: "Failed to fetch one image per category! " + err});
  }
}


export async function UpdateImageInformation(formData: FormData) {
  try {
    const id = formData.get("image_id");
    const caption = formData.get("caption");

    const query = {
      caption: caption,
    };

    await prisma.UserImages.update({
      where: {id: id}, data: query});

    return {success: true};
  } catch (err) {
    return({error: "Failed to update image information! " + err});
  }
}
