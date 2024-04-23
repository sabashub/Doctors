import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { Category } from '../../models/Category';

@Component({
  selector: 'app-handle-categories',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './handle-categories.component.html',
  styleUrl: './handle-categories.component.css'
})
export class HandleCategoriesComponent implements OnInit{
  categories: Category[] = []; // Array to hold added categories
  
  newCategory: string = '';
  editedCategory: Category | null = null;
  editedCategoryIndex: number = -1;

  constructor(private appService: AppService){}
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories() {
    this.appService.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log(this.categories);
    });
  }

  addCategory() {
    if (this.newCategory.trim() !== '') {
      this.appService.addCategory(this.newCategory.trim()).subscribe(response => {
        this.categories.push(response.name); // Assuming backend returns the added category
        this.newCategory = '';
        this.loadCategories();
      });
    }
  }
  editCategory(index: number): void {
    // Set the edited category and its index
    this.editedCategory = { ...this.categories[index] };
    this.editedCategoryIndex = index;
    // Open the prompt or modal for editing
    // Example: Show a prompt with the current category name for editing
    const newName = prompt('Enter the new category name:', this.editedCategory.name);
    if (newName !== null) {
      // If the user didn't cancel the prompt, update the category name
      this.editedCategory.name = newName;
      this.updateCategory();
    }
  }

  updateCategory(): void {
    if (this.editedCategory && this.editedCategoryIndex !== -1) {
      // Call the service to update the category
      this.appService.updateCategory(this.editedCategory.id, this.editedCategory)
        .subscribe(() => {
          console.log('Category updated successfully');
          // Update the category in the list
          this.categories[this.editedCategoryIndex] = { ...this.editedCategory! };
          // Reset the edited category and index
          this.editedCategory = null;
          this.editedCategoryIndex = -1;
        }, error => {
          console.error('Error updating category:', error);
        });
    }
  }


  deleteCategory(index: number, categoryId: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.appService.deleteCategory(categoryId).subscribe(() => {
        this.categories.splice(index, 1);
      });
    }
  }


}
