-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql_db
-- Generation Time: Mar 17, 2026 at 06:03 PM
-- Server version: 9.6.0
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `id` int NOT NULL,
  `asset_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('IT','Furniture','Office','Other') DEFAULT 'IT',
  `status` enum('active','borrowing','repair') NOT NULL DEFAULT 'active',
  `location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`id`, `asset_code`, `name`, `category`, `status`, `location`, `created_at`) VALUES
(1, 'NB-001', 'Laptop Dell XPS', 'IT', 'active', NULL, '2026-03-14 14:50:25'),
(2, 'NB-002', 'MacBook Air M2', 'IT', 'active', NULL, '2026-03-14 14:50:25'),
(3, 'CAM-01', 'Canon EOS R6', 'IT', 'active', NULL, '2026-03-14 14:50:25'),
(4, 'IT-001', 'MacBook Pro M3', 'IT', 'active', NULL, '2026-03-14 15:27:35'),
(5, 'IT-002', 'iPad Pro 11\"', 'IT', 'active', NULL, '2026-03-14 15:27:35'),
(15, 'IT-003', 'Monitor Dell 27\"', 'IT', 'active', NULL, '2026-03-14 15:42:51');

-- --------------------------------------------------------

--
-- Table structure for table `borrow_logs`
--

CREATE TABLE `borrow_logs` (
  `id` int NOT NULL,
  `asset_id` int NOT NULL,
  `borrower_name` varchar(255) NOT NULL,
  `borrow_date` date NOT NULL,
  `return_date` date NOT NULL,
  `reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `borrow_logs`
--

INSERT INTO `borrow_logs` (`id`, `asset_id`, `borrower_name`, `borrow_date`, `return_date`, `reason`, `created_at`) VALUES
(1, 1, 'Admin', '2026-03-16', '2026-03-21', '', '2026-03-16 17:04:23'),
(2, 1, 'Admin', '2026-03-16', '2026-03-21', '', '2026-03-16 17:04:52'),
(3, 2, 'Admin', '2026-03-16', '2026-03-21', '', '2026-03-16 17:05:26'),
(4, 3, 'Admin', '2026-03-16', '2026-03-20', '', '2026-03-16 17:12:31'),
(5, 4, 'Admin', '2026-03-16', '2026-03-28', '', '2026-03-16 17:12:53'),
(6, 1, 'Rattapong Saiyaphang', '2026-03-16', '2026-03-20', '', '2026-03-16 17:38:53'),
(7, 1, 'Rattapong Saiyaphang', '2026-03-16', '2026-03-21', '', '2026-03-16 17:39:30'),
(8, 2, 'Rattapong Saiyaphang', '2026-03-16', '2026-03-18', '', '2026-03-16 17:42:36'),
(9, 1, 'Rattapong Saiyaphang', '2026-03-16', '2026-03-20', '', '2026-03-16 17:48:03'),
(10, 2, 'Rattapong Saiyaphang', '2026-03-16', '2026-03-21', '', '2026-03-16 17:48:11'),
(11, 1, 'Rattapong Saiyaphang', '2026-03-17', '2026-03-14', '', '2026-03-17 14:31:00'),
(12, 1, 'Rattapong Saiyaphang', '2026-03-17', '2026-03-20', '', '2026-03-17 15:08:32');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `repair_logs`
--

CREATE TABLE `repair_logs` (
  `id` int NOT NULL,
  `asset_id` int DEFAULT NULL,
  `reporter_name` varchar(255) DEFAULT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `report_date` date DEFAULT NULL,
  `repair_status` enum('pending','in-progress','fixed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `repair_logs`
--

INSERT INTO `repair_logs` (`id`, `asset_id`, `reporter_name`, `description`, `location`, `report_date`, `repair_status`) VALUES
(1, 3, 'Rattapong Saiyaphang', 'ห', 'ห', '2026-03-17', 'pending'),
(2, 1, 'Rattapong Saiyaphang', 'ห', 'ห', '2026-03-17', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'bug'),
(4, 'design'),
(2, 'feature'),
(3, 'urgent');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `status` enum('todo','in_progress','done') DEFAULT 'todo',
  `project_id` int NOT NULL,
  `assigned_user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_tags`
--

CREATE TABLE `task_tags` (
  `task_id` int NOT NULL,
  `tag_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `asset_id` int DEFAULT NULL,
  `borrower_name` varchar(100) NOT NULL,
  `borrow_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `status` enum('borrowed','returned') DEFAULT 'borrowed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `display_name` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `firstname`, `lastname`, `display_name`, `password`) VALUES
(3, 'test@email.com', '', '', 'Admin', '123456'),
(4, '', '', '', '', ''),
(5, 'rattapong980@gmail.com', 'Rattapong', 'Saiyaphang', 'Rattapong Saiyaphang', '11'),
(6, 'nachaphat16149@gmail.com', 'nachaphat', 'hasatangsaikaew', 'nachaphat hasatangsaikaew', '12345678');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asset_code` (`asset_code`);

--
-- Indexes for table `borrow_logs`
--
ALTER TABLE `borrow_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `repair_logs`
--
ALTER TABLE `repair_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_user_id` (`assigned_user_id`);

--
-- Indexes for table `task_tags`
--
ALTER TABLE `task_tags`
  ADD PRIMARY KEY (`task_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assets`
--
ALTER TABLE `assets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `borrow_logs`
--
ALTER TABLE `borrow_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `repair_logs`
--
ALTER TABLE `repair_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrow_logs`
--
ALTER TABLE `borrow_logs`
  ADD CONSTRAINT `borrow_logs_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `task_tags`
--
ALTER TABLE `task_tags`
  ADD CONSTRAINT `task_tags_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
