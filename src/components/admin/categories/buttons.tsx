"use client";
import React, {useState} from "react";
import Link from "next/link";
import { deleteCategory } from "@/actions/category-actions";
import { TbArrowRight, TbDotsVertical, TbEdit, TbEye, TbTrash, TbPlus, TbCircle} from 'react-icons/tb';
import { Button, Modal } from "react-bootstrap";

interface CategoriesButtonProps {
  id: string;
}

export function DeleteCategoryBtn({ id }: CategoriesButtonProps) {
  const deleteCategoryWithId = deleteCategory.bind(null, id);
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        variant="danger"
        className="btn-icon rounded-circle"
        type="button"
        title="Delete category"
        aria-label={`Delete category ${id}`}
        onClick={() => setShowModal(true)}
      >
        <TbTrash className="fs-lg" />
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" className="btn-sm" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <form action={deleteCategoryWithId} className="d-inline">
            <Button variant="danger" className="btn-sm"  type="submit" onClick={() => setShowModal(false)}>
              Delete
            </Button>
          </form>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function CreateCategoryBtn() {
  return (
    <Link href="/admin/categories/create" className="btn btn-primary">
      <span className="hidden md:block">Add New Category</span>{" "}
      <TbPlus size={24} />
    </Link>
  );
}

export function EditCategoryBtn({ id }: CategoriesButtonProps) {
  return (
    <Link
      href={`/admin/categories/${id}`}>
    <Button variant="light" size="sm" className="btn-icon rounded-circle">
        <TbEdit className="fs-lg" />
    </Button>
    </Link>
  );
}

export function CancelCategoryBtn() {
  return (
    <Link
      href="/admin/categories"
      className="flex h-10 items-center rounded-lg bg-gray-400 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
    >
      <span className="hidden md:block">Cancel</span>{" "}
      <TbCircle className="h-6 md:ml-4" />
    </Link>
  );
}

export function SaveCategoryBtn() {
  return (
    <Button type="submit" variant="primary">Save Category Information
      <TbPlus size={24} />
    </Button>
  );
}