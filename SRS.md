# Software Requirements Specification (SRS)
## Project: TIB - Task & Idea Board

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to define the software requirements for the **Task & Idea Board (TIB)** application. TIB is a web-based Kanban-style project management tool designed to help individuals organize tasks, visualize workflows, and improve productivity.

#### 1.2 Scope
The application allows users to create accounts, manage multiple boards, and organize tasks within those boards using columns and cards. Key features include drag-and-drop functionality, task prioritization, and search capabilities.

### 2. Overall Description
#### 2.1 Product Perspective
TIB is a standalone web application consisting of a React frontend and a Node.js/Express backend, utilizing a PostgreSQL database for persistent storage.

#### 2.2 User Characteristics
The primary users are individuals looking for a simple, intuitive tool to manage personal projects or daily tasks. No technical expertise is required to use the application.

### 3. Functional Requirements

#### 3.1 User Authentication
*   **FR-01 Signup**: Users must be able to create an account using an email and password.
*   **FR-02 Login**: Users must be able to authenticate using their registered email and password.
*   **FR-03 Session Management**: The system must maintain user sessions using JWT (JSON Web Tokens).
*   **FR-04 Logout**: Users must be able to terminate their session securely.

#### 3.2 Board Management
*   **FR-05 Create Board**: Authenticated users can create new boards with a custom title.
*   **FR-06 View Boards**: Users can view a list of all boards they have created.
*   **FR-07 Delete Board**: Users can delete a board. This action must cascade and delete all associated columns and cards.

#### 3.3 Column Management
*   **FR-08 Default Columns**: New boards must be initialized with default columns (e.g., "To Do", "In Progress", "Done").
*   **FR-09 Add Column**: Users can add new columns to a board.
*   **FR-10 Delete Column**: Users can delete a column. This action must cascade and delete all cards within that column.

#### 3.4 Card Management
*   **FR-11 Create Card**: Users can add tasks (cards) to any column with a title, description, priority, and due date.
*   **FR-12 Edit Card**: Users can modify the details of an existing card.
*   **FR-13 Delete Card**: Users can remove a card from the board.
*   **FR-14 Drag and Drop**: Users can move cards between columns or reorder them within the same column using drag-and-drop interactions.
*   **FR-15 Search**: Users can filter cards on the board by title or description.

### 4. Non-Functional Requirements

#### 4.1 Security
*   **NFR-01 Password Storage**: Passwords must be hashed using bcrypt before storage.
*   **NFR-02 API Security**: All API endpoints (except auth) must require a valid JWT token.

#### 4.2 Performance
*   **NFR-03 UI Responsiveness**: Drag-and-drop operations should feel instantaneous to the user.
*   **NFR-04 Load Time**: The dashboard and board views should load within 2 seconds under normal network conditions.

#### 4.3 Usability
*   **NFR-05 Interface**: The UI shall implement a modern "Glassmorphism" aesthetic with intuitive navigation.
*   **NFR-06 Feedback**: The system must provide visual feedback for actions (e.g., loading states, success messages, error alerts).
