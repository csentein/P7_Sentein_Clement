-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : sam. 26 juin 2021 à 18:39
-- Version du serveur :  10.3.30-MariaDB
-- Version de PHP : 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sema4340_groupomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `authorId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `authorId`, `postId`, `content`, `createdAt`, `updatedAt`) VALUES
(1, 5, 1, 'Bravo !', '2021-06-26 16:15:47', '2021-06-26 16:15:47'),
(2, 3, 2, 'Bon travail Patrick', '2021-06-26 16:17:42', '2021-06-26 16:17:42');

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `authorId` int(11) NOT NULL,
  `postId` int(11) DEFAULT NULL,
  `commentId` int(11) DEFAULT NULL,
  `reaction` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `authorId`, `postId`, `commentId`, `reaction`, `createdAt`, `updatedAt`) VALUES
(1, 5, 1, NULL, 1, '2021-06-26 16:15:49', '2021-06-26 16:15:49'),
(2, 3, 2, NULL, 1, '2021-06-26 16:17:43', '2021-06-26 16:17:43'),
(3, 3, NULL, 1, 1, '2021-06-26 16:17:45', '2021-06-26 16:17:45'),
(4, 3, 1, NULL, 1, '2021-06-26 16:17:47', '2021-06-26 16:17:47');

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `authorId` int(11) NOT NULL,
  `content` text NOT NULL,
  `imageFile` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `authorId`, `content`, `imageFile`, `createdAt`, `updatedAt`) VALUES
(1, 4, 'Je viens de me créer un compte !', 'creercompte_1624724135671.jpeg', '2021-06-26 16:15:35', '2021-06-26 16:15:35'),
(2, 5, 'Un peu de développement web :)', NULL, '2021-06-26 16:17:26', '2021-06-26 16:17:26'),
(3, 3, 'Un peu de sport ce matin', 'homme-sport-dehors-min_1624724422419.jpg', '2021-06-26 16:20:22', '2021-06-26 16:20:22');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `avatarFile` varchar(255) DEFAULT 'defaultavatar.png',
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstName`, `lastName`, `avatarFile`, `isAdmin`, `createdAt`, `updatedAt`) VALUES
(1, 'admingroupo@groupo.fr', '$2b$10$9TVMDjvOmpXR4eHk9.lGJe2eS2nJ62Lq6cxcSmdQFAyPVIlmFHUEe', 'Admin', 'Groupo', 'defaultavatar.png', 1, '2021-06-26 16:14:03', '2021-06-26 16:14:03'),
(3, 'johngroupo@groupo.fr', '$2b$10$gMhARCeqcFSKuKQYi4mW0eddv/8/ObMtsAsU2ywCsxlnGoxSl.lkS', 'John', 'Groupo', 'conseils-courir-froid_1624724735736.png', 0, '2021-06-26 16:14:21', '2021-06-26 16:25:36'),
(4, 'laurenagroupo@groupo.fr', '$2b$10$hpZHq3xreKDLAA.fqrUHv.dxYmPbPyMx39nXd7Le8uyDbHMvjcD6O', 'Laurena', 'Groupo', 'laurena_1624724115294.jpeg', 0, '2021-06-26 16:14:33', '2021-06-26 16:15:16'),
(5, 'patrickgroupo@groupo.fr', '$2b$10$anleTs9aktZ3sWIn/35ip.8eu1DPAfjhIYP14q7Qt6Vbr6VLMfHMO', 'Patrick', 'Groupo', 'defaultavatar.png', 0, '2021-06-26 16:14:43', '2021-06-26 16:14:43');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authorId` (`authorId`),
  ADD KEY `postId` (`postId`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authorId` (`authorId`),
  ADD KEY `postId` (`postId`),
  ADD KEY `commentId` (`commentId`);

--
-- Index pour la table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authorId` (`authorId`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`commentId`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
