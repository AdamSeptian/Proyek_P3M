-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2026 at 02:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `p3m-app`
--

-- --------------------------------------------------------

--
-- Table structure for table `agendas`
--

CREATE TABLE `agendas` (
  `uuid` varchar(255) NOT NULL,
  `users_uuid` varchar(255) NOT NULL,
  `nama_kegiatan` varchar(255) NOT NULL,
  `tuan_rumah` varchar(255) NOT NULL,
  `jadwal` date NOT NULL,
  `status` enum('pending','rejected','verified') NOT NULL DEFAULT 'pending',
  `file` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agendas`
--

-- --------------------------------------------------------

--
-- Table structure for table `anggotas`
--

CREATE TABLE `anggotas` (
  `uuid` varchar(255) NOT NULL,
  `users_uuid` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) DEFAULT NULL,
  `gelar` varchar(255) DEFAULT NULL,
  `jabatan` varchar(255) DEFAULT NULL,
  `masa_jabat` varchar(255) DEFAULT NULL,
  `instansi` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `google_scholar` varchar(255) DEFAULT NULL,
  `scopus` varchar(255) DEFAULT NULL,
  `sinta` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `anggotas`
--

-- --------------------------------------------------------

--
-- Table structure for table `beritas`
--

CREATE TABLE `beritas` (
  `uuid` varchar(255) NOT NULL,
  `users_uuid` varchar(255) NOT NULL,
  `judul_berita` varchar(255) NOT NULL,
  `isi_berita` longtext NOT NULL,
  `status` enum('pending','rejected','verified') NOT NULL DEFAULT 'pending',
  `image` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `beritas`
--

-- --------------------------------------------------------

--
-- Table structure for table `berita_kategori`
--

CREATE TABLE `berita_kategori` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `berita_uuid` varchar(255) NOT NULL,
  `kategori_uuid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `berita_kategori`
--

-- --------------------------------------------------------

--
-- Table structure for table `berita_tag`
--

CREATE TABLE `berita_tag` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `berita_uuid` varchar(255) NOT NULL,
  `tag_uuid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `berita_tag`
--

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `uuid` varchar(255) NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`uuid`, `nama_kategori`, `createdAt`, `updatedAt`) VALUES
('0b40a469-886a-4ca5-aa1e-2ff9c0f01050', 'asdasdasd', '2026-05-14 12:27:14', '2026-05-14 12:27:14'),
('ae033119-82b6-4ddd-9db1-c491ee2c3c23', 'asdasd', '2026-05-14 11:47:03', '2026-05-14 11:47:03');

-- --------------------------------------------------------

--
-- Table structure for table `landing_pages`
--

CREATE TABLE `landing_pages` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) DEFAULT 'home',
  `hero` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`hero`)),
  `tradition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tradition`)),
  `footer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`footer`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `landing_pages`
--

-- --------------------------------------------------------

--
-- Table structure for table `laporans`
--

CREATE TABLE `laporans` (
  `uuid` varchar(255) NOT NULL,
  `users_uuid` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `status` enum('pending','rejected','verified') NOT NULL DEFAULT 'pending',
  `file_laporan` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `laporans`
--

-- --------------------------------------------------------

--
-- Table structure for table `pengurus`
--

CREATE TABLE `pengurus` (
  `uuid` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL,
  `instansi` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengurus`
--

-- --------------------------------------------------------

--
-- Table structure for table `profil_organisasi`
--

CREATE TABLE `profil_organisasi` (
  `uuid` varchar(255) NOT NULL,
  `users_uuid` varchar(255) NOT NULL,
  `nama_organisasi` varchar(255) NOT NULL,
  `deskripsi_organisasi` longtext NOT NULL,
  `status` enum('pending','rejected','verified') NOT NULL DEFAULT 'pending',
  `image` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profil_organisasi`
--

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `uuid` varchar(255) NOT NULL,
  `nama_tag` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tag`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uuid` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `status` enum('pending','rejected','verified') NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uuid`, `username`, `email`, `password`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('00333324-8b77-4282-9b44-5e92ad8cef09', 'Humas P3M', 'humas@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$RYHF813pFeJuvx9xSimEWA$fijUVFvkyC5yQTsH3mxJG6WqqL+2Qxztb7zeU7b4NrI', 'humas', 'verified', '2026-04-22 07:41:09', '2026-04-28 16:19:08'),
('2d643c98-d7a7-4d76-933b-b49801a7531b', 'user', 'adamrpl23444sss@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$p78lNzq3MzRCWHfwKyoY1g$/aDDdEde5Qstin+3R/vkGXGunA2aqe0+TDeF4fsl+As', 'ketua_forum', 'verified', '2026-05-14 18:05:57', '2026-05-14 18:05:57'),
('2f1e5f2c-cf77-4678-ad99-d197329e1547', 'asdasd edited', 'adam@gmail.commmmmmm', '$argon2id$v=19$m=65536,t=3,p=4$yHrwXxw4ok2lW8WVj0NByQ$fJCmc099S2gbORS6Dyj5CUqUt2uf7sFGi7bkCNy0wOY', 'anggota', 'verified', '2026-04-22 07:08:26', '2026-05-01 18:10:05'),
('4d95f35e-8d22-4cae-a981-0879713d5977', 'Ketua Forum P3M', 'ketua@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$HJXmdALDqIE4kWIfe+m7yA$otMgCEApTOcUwC2Kw5BfNGJcSD3/ozMrC8wlSUVuAWU', 'ketua_forum', 'verified', '2026-04-22 06:53:35', '2026-05-17 10:18:56'),
('67cbaa15-f76d-4a1a-947c-208c2e05d495', 'Adam Septian Bintara', 'adam@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$inNkJ05+CXPCyFB9M5YwAg$0Yf4U6gjPUseno88WzwEKF3GdOnCIyJQP25KXGptUsY', 'anggota', 'verified', '2026-05-01 16:08:50', '2026-05-17 14:21:49'),
('6a81db08-6893-4b58-9f33-7adbfeab5579', 'kjkjkj', 'jkjkjkjk@exm.com', '$argon2id$v=19$m=65536,t=3,p=4$NbIoCC627F+dSa+z6RhsSg$caEUK/doHTVYDWO2VCgj7+Q589nj7uIiVrG651SVvTU', 'anggota', 'verified', '2026-05-05 04:51:42', '2026-05-23 07:55:22'),
('7a6163c5-ae8f-4bbf-aeb2-e6559b68e060', 'asda', 'sdasdas@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$+e+cQ26zjo3jiOpaZgW7Tg$bGZJ8B2XSSPVdeWJaG9rkLmYgV0ootKqzQLjI3d5vcc', 'anggota', 'verified', '2026-04-29 06:03:46', '2026-04-29 06:11:11'),
('7f2cf54a-a2a3-4e54-962e-31e87bee9a9e', 'aku user', 'akuuserbaru@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$5gXuySGPvaqmhgtk673B+A$QVHvNeQK88yBCfyxDdLMrx/kPlwRSPImRCelCUumMH4', 'anggota', 'rejected', '2026-05-14 16:54:00', '2026-05-14 17:29:54'),
('8206bae0-d603-427f-852c-890457d6bdfd', 'asd', 'asdasdasd@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$nAoBMdQGYZ4WqJRzQaLhfw$HZitEx9oTD1TvEInCr7Vk5XYwnVG3tSiFaHGdM1bYtk', 'ketua_forum', 'verified', '2026-04-22 07:26:47', '2026-04-22 07:26:47'),
('853093f0-7582-4f4c-b80b-ee5c8d1618a0', 'asdasd edited asd', 'desir982sss5@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$8GEDhrgRAO7trsObB0E7ow$Xp/AXoWGtHAX4W2pmEIIMaQoeBFXcWhR/we4JlbkxI4', 'anggota', 'verified', '2026-05-14 16:51:47', '2026-05-23 07:55:19'),
('b1e94ad1-e6ac-4500-89b1-2a8e6e99c2f2', 'admin', 'admin@mail.com', '$argon2id$v=19$m=65536,t=3,p=4$9VKOLuwR1sELD0kVYkjw6w$NcHepFE2ZQHOHHhGoaXEoY+YYASU77x65h+GPUkHr48', 'admin', 'verified', '2026-04-21 10:37:09', '2026-04-22 09:32:10'),
('b4816297-eb4c-48b8-8558-6edc5d369fdf', 'asdasd edited lagi', 'adamrpl234@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$gnushdLra8zA3AkN8YcVQw$zRmyp65zvZftpdapvBYqN5sBJJDzppK4s6n7hxpIafc', 'admin', 'verified', '2026-04-22 07:26:59', '2026-04-28 15:41:32'),
('e453d145-e290-4ef0-8332-95e8ce15f373', 'asdasdasdas', 'desir9825@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$5Rdpwj+yb4ferGGhMZ2Z1A$8+CyeMPTRuQVJXX3bkYU2xyefz7mXZXtKUJ7fI7BUi0', 'anggota', 'verified', '2026-04-29 06:12:06', '2026-04-29 06:12:16'),
('e611986b-aa35-4c7a-93f9-d7509fabae2d', 'asda', 'asdasdasdasdasd@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$rds/5m2edND2/PlT+oRXeQ$RAkaEbs7hWlbkc8CGphG3BRuV8OUBVpg/3kPGIOYBaM', 'anggota', 'verified', '2026-05-01 16:10:25', '2026-05-01 18:10:07'),
('e6e02969-019e-4cd6-9a98-9f2e0f321030', 'admin', 'akuuser1@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$o8CUF+EzUCpiM6bphHre2g$eP4n7Dt8Um4SxYWXTqMi3hZHm5I6ImYQYvo+GQJ+Hqw', 'anggota', 'verified', '2026-05-14 16:54:44', '2026-05-17 14:22:20'),
('f9261fe8-5c42-4a49-9fec-6dbe322f0ab1', 'user', 'adamrpl23444@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$X6Jw6ZSR4Aq+/J0U7q98Kw$RTHb1CSyCY3e5SUcr5KpSKeRS1t+nyfQELIY+D0NAFU', 'ketua_forum', 'verified', '2026-05-14 16:41:35', '2026-05-14 16:41:35'),
('fab0b483-b0b6-4549-8f66-5845ded84742', 'aku user', 'akuuser@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$aPdJzxhI7Q9GZFgMiO/3LA$5umebuneFiOYvBEAKivISjFGRFQckOpviNviWCq3FD4', 'anggota', 'verified', '2026-05-14 16:43:29', '2026-05-23 07:55:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agendas`
--
ALTER TABLE `agendas`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `users_uuid` (`users_uuid`);

--
-- Indexes for table `anggotas`
--
ALTER TABLE `anggotas`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `users_uuid` (`users_uuid`);

--
-- Indexes for table `beritas`
--
ALTER TABLE `beritas`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `users_uuid` (`users_uuid`);

--
-- Indexes for table `berita_kategori`
--
ALTER TABLE `berita_kategori`
  ADD PRIMARY KEY (`berita_uuid`,`kategori_uuid`),
  ADD KEY `kategori_uuid` (`kategori_uuid`);

--
-- Indexes for table `berita_tag`
--
ALTER TABLE `berita_tag`
  ADD PRIMARY KEY (`berita_uuid`,`tag_uuid`),
  ADD KEY `tag_uuid` (`tag_uuid`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_2` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_3` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_4` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_5` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_6` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_7` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_8` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_9` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_10` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_11` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_12` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_13` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_14` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_15` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_16` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_17` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_18` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_19` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_20` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_21` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_22` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_23` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_24` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_25` (`nama_kategori`);

--
-- Indexes for table `landing_pages`
--
ALTER TABLE `landing_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `laporans`
--
ALTER TABLE `laporans`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `users_uuid` (`users_uuid`);

--
-- Indexes for table `pengurus`
--
ALTER TABLE `pengurus`
  ADD PRIMARY KEY (`uuid`);

--
-- Indexes for table `profil_organisasi`
--
ALTER TABLE `profil_organisasi`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `users_uuid` (`users_uuid`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `nama_tag` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_2` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_3` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_4` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_5` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_6` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_7` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_8` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_9` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_10` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_11` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_12` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_13` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_14` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_15` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_16` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_17` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_18` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_19` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_20` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_21` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_22` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_23` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_24` (`nama_tag`),
  ADD UNIQUE KEY `nama_tag_25` (`nama_tag`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uuid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `landing_pages`
--
ALTER TABLE `landing_pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agendas`
--
ALTER TABLE `agendas`
  ADD CONSTRAINT `agendas_ibfk_1` FOREIGN KEY (`users_uuid`) REFERENCES `users` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `anggotas`
--
ALTER TABLE `anggotas`
  ADD CONSTRAINT `anggotas_ibfk_1` FOREIGN KEY (`users_uuid`) REFERENCES `users` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `beritas`
--
ALTER TABLE `beritas`
  ADD CONSTRAINT `beritas_ibfk_1` FOREIGN KEY (`users_uuid`) REFERENCES `users` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `berita_kategori`
--
ALTER TABLE `berita_kategori`
  ADD CONSTRAINT `berita_kategori_ibfk_1` FOREIGN KEY (`berita_uuid`) REFERENCES `beritas` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `berita_kategori_ibfk_2` FOREIGN KEY (`kategori_uuid`) REFERENCES `kategori` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `berita_tag`
--
ALTER TABLE `berita_tag`
  ADD CONSTRAINT `berita_tag_ibfk_1` FOREIGN KEY (`berita_uuid`) REFERENCES `beritas` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `berita_tag_ibfk_2` FOREIGN KEY (`tag_uuid`) REFERENCES `tag` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `laporans`
--
ALTER TABLE `laporans`
  ADD CONSTRAINT `laporans_ibfk_1` FOREIGN KEY (`users_uuid`) REFERENCES `users` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `profil_organisasi`
--
ALTER TABLE `profil_organisasi`
  ADD CONSTRAINT `profil_organisasi_ibfk_1` FOREIGN KEY (`users_uuid`) REFERENCES `users` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
