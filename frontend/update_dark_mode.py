#!/usr/bin/env python3
"""
Script to add dark mode classes to all React components
"""
import os
import re

# Define replacement patterns
REPLACEMENTS = [
    # Text colors
    (r'text-gray-900\b', 'text-gray-900 dark:text-gray-100'),
    (r'text-gray-800\b', 'text-gray-800 dark:text-gray-100'),
    (r'text-gray-700\b', 'text-gray-700 dark:text-gray-300'),
    (r'text-gray-600\b', 'text-gray-600 dark:text-gray-400'),
    (r'text-gray-500\b', 'text-gray-500 dark:text-gray-400'),
    (r'text-gray-400\b', 'text-gray-400 dark:text-gray-500'),
    
    # Backgrounds
    (r'bg-white\b(?!.*dark:bg-)', 'bg-white dark:bg-gray-800'),
    (r'bg-gray-50\b(?!.*dark:bg-)', 'bg-gray-50 dark:bg-gray-900'),
    (r'bg-gray-100\b(?!.*dark:bg-)', 'bg-gray-100 dark:bg-gray-800'),
    (r'bg-gray-200\b(?!.*dark:bg-)', 'bg-gray-200 dark:bg-gray-700'),
    
    # Borders
    (r'border-gray-200\b(?!.*dark:border-)', 'border-gray-200 dark:border-gray-700'),
    (r'border-gray-300\b(?!.*dark:border-)', 'border-gray-300 dark:border-gray-600'),
    
    # Hover states
    (r'hover:bg-gray-50\b(?!.*dark:hover:bg-)', 'hover:bg-gray-50 dark:hover:bg-gray-700'),
    (r'hover:bg-gray-100\b(?!.*dark:hover:bg-)', 'hover:bg-gray-100 dark:hover:bg-gray-800'),
    (r'hover:bg-gray-200\b(?!.*dark:hover:bg-)', 'hover:bg-gray-200 dark:hover:bg-gray-700'),
]

def update_file(filepath):
    """Update a single file with dark mode classes"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply all replacements
        for pattern, replacement in REPLACEMENTS:
            content = re.sub(pattern, replacement, content)
        
        # Only write if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated: {filepath}")
            return True
        return False
    except Exception as e:
        print(f"✗ Error updating {filepath}: {e}")
        return False

def main():
    """Main function to process all files"""
    # Get the frontend src directory
    base_dir = os.path.join(os.path.dirname(__file__), 'src')
    
    # Directories to process
    directories = [
        os.path.join(base_dir, 'pages'),
        os.path.join(base_dir, 'components'),
    ]
    
    updated_count = 0
    total_count = 0
    
    for directory in directories:
        if not os.path.exists(directory):
            continue
            
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith(('.jsx', '.js')):
                    filepath = os.path.join(root, file)
                    total_count += 1
                    if update_file(filepath):
                        updated_count += 1
    
    print(f"\n{'='*50}")
    print(f"Processed {total_count} files")
    print(f"Updated {updated_count} files")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
