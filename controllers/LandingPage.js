import LandingPage from "../models/LandingPage.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fungsi untuk ambil gambar landing page (Public)
export const getLandingImage = async (req, res) => {
    try {
        const { folder, filename } = req.params;
        // Kita batasi folder agar tidak bisa akses sembarang folder di server
        const allowedFolders = ["home"]; 
        if (!allowedFolders.includes(folder)) {
            return res.status(403).json({ msg: "Akses folder ditolak" });
        }

        const filePath = path.join(__dirname, "../storage/landing_page", folder, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ msg: "Gambar tidak ditemukan" });
        }

        // Karena landing page bersifat publik, tidak perlu cek verifikasi di sini
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getLandingPage = async (req, res) => {
    try {
        const landing = await LandingPage.findOne({ where: { slug: "home" } });
        if (!landing) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const parseSafe = (data) => {
            try {
                if (typeof data === 'string') {
                    const parsed = JSON.parse(data);
                    return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
                }
                return data;
            } catch (e) { return data; }
        };

        res.status(200).json({
            success: true,
            message: "Landing loaded",
            data: {
                slug: landing.slug,
                sections: {
                    hero: parseSafe(landing.hero),
                    tradition: parseSafe(landing.tradition),
                    footer: parseSafe(landing.footer)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getUploadedImages = async (req, res) => {
    try {
        const directoryPath = path.join(__dirname, "../storage/landing_page/home");
        
        // Cek apakah direktori ada
        if (!fs.existsSync(directoryPath)) {
            return res.status(200).json({ images: [] });
        }

        // Baca semua file di dalam folder
        fs.readdir(directoryPath, (err, files) => {
            if (err) return res.status(500).json({ msg: "Gagal memuat file" });

            // Filter hanya file gambar dan tambahkan prefix path
            const imageList = files
                .filter(file => /\.(jpg|jpeg|png|gif)$/.test(file))
                .map(file => `landing_page/home/${file}`);

            res.status(200).json({
                success: true,
                images: imageList
            });
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateLandingData = async (req, res) => {
  try {
    const { hero, tradition, footer, tempDeletedFiles } = req.body;

    if (hero?.slides?.length > 5) {
      return res.status(400).json({ success: false, msg: "Maksimal 5 slide." });
    }

    if (tempDeletedFiles && Array.isArray(tempDeletedFiles)) {
      tempDeletedFiles.forEach((filePath) => {
        if (filePath) {
          const fullPath = path.join(process.cwd(), "storage", filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("File sampah dihapus:", filePath);
          }
        }
      });
    }

    const oldLanding = await LandingPage.findOne({ where: { slug: "home" } });

    if (oldLanding) {
      // 1. Ambil data lama & baru (pastikan diparse jika masih string)
      const parseData = (d) => (typeof d === 'string' ? JSON.parse(d) : d);
      
      const oldHero = parseData(oldLanding.hero);
      const oldTradition = parseData(oldLanding.tradition);
      
      const oldHeroSlides = oldHero?.slides || [];
      const oldTraditionImg = oldTradition?.image;

      const newHeroSlides = hero?.slides || [];
      const newTraditionImg = tradition?.image;

      // 2. Fungsi Helper untuk hapus file agar tidak berulang
      const deleteFile = (relativePath) => {
        if (!relativePath) return;
        // Kita arahkan tepat ke folder storage dari posisi controllers
        const absolutePath = path.resolve(__dirname, "../../backend/storage", relativePath); 
        // ATAU gunakan ini jika folder storage ada di root project:
        const rootPath = path.join(process.cwd(), "storage", relativePath);

        if (fs.existsSync(rootPath)) {
          fs.unlinkSync(rootPath);
          console.log("File dihapus:", rootPath);
        } else {
          console.log("File tidak ditemukan untuk dihapus:", rootPath);
        }
      };

      // 3. Cek Slide Hero yang dihapus
      oldHeroSlides.forEach((oldSlide) => {
        const isStillUsed = newHeroSlides.some(newSlide => newSlide.image === oldSlide.image);
        if (!isStillUsed) {
          deleteFile(oldSlide.image);
        }
      });

      // 4. Cek Gambar Tradition yang diganti
      if (oldTraditionImg && oldTraditionImg !== newTraditionImg) {
        deleteFile(oldTraditionImg);
      }

      // 5. Update Database
      await oldLanding.update({
        hero: hero || oldLanding.hero,
        tradition: tradition || oldLanding.tradition,
        footer: footer || oldLanding.footer
      });
    } else {
      await LandingPage.create({
        slug: "home",
        hero: hero || { slides: [] },
        tradition: tradition || { items: [] },
        footer: footer || { contacts: [], addresses: [] }
      });
    }

    res.status(200).json({ success: true, msg: "Data diperbarui & storage dibersihkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

// 3. UPLOAD Hero Slide Image (Helper untuk upload gambar ke dalam array hero)
export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "Tidak ada gambar yang diunggah" });
    }

    const file = req.files.file;
    const ext = path.extname(file.name).toLowerCase();
    const fileName = file.md5 + "-" + Date.now() + ext;
    const uploadPath = `./storage/landing_page/home/${fileName}`;

    // Pastikan folder tersedia
    const dir = "./storage/landing_page/home";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await file.mv(uploadPath);

    // Kirim response path-nya saja
    res.status(200).json({
      msg: "Gambar berhasil diunggah",
      imagePath: `landing_page/home/${fileName}` // Gunakan path ini di frontend
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 4. CREATE Initial Data (Hanya dijalankan sekali saat setup pertama kali)
export const setupLandingPage = async (req, res) => {
    try {
        const exist = await LandingPage.findOne({ where: { slug: "home" } });
        if (exist) return res.status(400).json({ msg: "Setup sudah dilakukan" });

        const defaultData = {
            slug: "home",
            hero: { slides: [] },
            tradition: { 
                image: "", 
                title: "Tradisi yang Hidup", 
                subtitle: "SEMANGAT JANTUNG JAWA", 
                items: [] 
            },
            footer: {
                emailMarketing: "",
                emailInfo: "",
                socials: [],
                contacts: [], // Array untuk nama, email, no telp dinamis
                addresses: [] // Array untuk multiple sekretariat
            }
        };

        await LandingPage.create(defaultData);
        res.status(201).json({ msg: "Initial landing page created" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}