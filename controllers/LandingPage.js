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
    const { hero, tradition, footer } = req.body;

    // --- VALIDASI MAKSIMAL 5 SLIDE ---
    if (hero && hero.slides && Array.isArray(hero.slides)) {
      if (hero.slides.length > 5) {
        return res.status(400).json({ 
          success: false, 
          msg: "Batas maksimal hero slide adalah 5 gambar." 
        });
      }
    }
    // ---------------------------------

    // Gunakan findOrCreate: Cari data 'home', kalau ga ada buat baru
    const [landing, created] = await LandingPage.findOrCreate({
      where: { slug: "home" },
      defaults: {
        hero: hero || { slides: [] },
        tradition: tradition || { items: [] },
        footer: footer || { contacts: [], addresses: [] }
      }
    });

    // Jika data sudah ada, maka kita update
    if (!created) {
      await landing.update({
        hero: hero || landing.hero,
        tradition: tradition || landing.tradition,
        footer: footer || landing.footer
      });
    }

    res.status(200).json({ 
      success: true, 
      msg: "Landing page berhasil diperbarui" 
    });
  } catch (error) {
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