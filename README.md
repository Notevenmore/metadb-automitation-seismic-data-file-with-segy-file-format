# Website MetaDB

**Website MetaDB** adalah platform yang dirancang untuk katalogisasi data seismik. Website ini memungkinkan pengguna untuk menghubungkan direktori lokal mereka dengan sistem, sehingga memudahkan dalam mengelola dan menampilkan data seismik secara efisien.

## Fitur Utama

1. **Koneksi dengan Direktori Lokal**
   - Pengguna dapat memilih direktori lokal yang berisi file seismik untuk dihubungkan dengan website. Hal ini memudahkan dalam mengakses dan mengelola file yang diperlukan.
     <table align="center" style="border: none;">
      <tr>
        <td align="center">
          <img src="https://github.com/user-attachments/assets/ca28e7c4-c347-4e21-9e38-3b4d4a9abccd" />
          <br>
          Halaman Koneksi dengan direktori local
        </td>
      </tr>
    </table>

2. **Pemilihan File untuk Ekstraksi**
   - Setelah menghubungkan direktori, pengguna dapat memilih file yang akan diekstrak untuk mendapatkan data seismik. Proses pemilihan file ini dirancang untuk memudahkan pengguna dalam menavigasi dan menemukan file yang relevan.
     <table align="center" style="border: none;">
      <tr>
        <td align="center">
          <img src="https://github.com/user-attachments/assets/919c841a-2e05-455a-bce4-38ef78764bbd" />
          <br>
          Halaman Pemilihan file untuk ekstraksi data dan hasil estraksi data
        </td>
      </tr>
    </table>

3. **Konfirmasi Data**
   - Setelah ekstraksi data, pengguna akan diminta untuk mengonfirmasi data yang telah diambil. Ini memastikan bahwa hanya data yang relevan dan akurat yang akan diproses lebih lanjut.
     <table align="center" style="border: none;">
      <tr>
        <td align="center">
          <img src="https://github.com/user-attachments/assets/ca901a40-d999-4c2e-a015-238afa1a22a1" />
          <br>
          Halaman Konfirmasi hasil estraksi data 
        </td>
      </tr>
    </table>

4. **Integrasi dengan Google Spreadsheet**
   - Semua prosedur ekstraksi dan data yang dihasilkan akan ditampilkan di Google Spreadsheet. Ini memberikan tampilan yang terorganisir dan mudah diakses untuk analisis lebih lanjut.
     <table align="center" style="border: none;">
      <tr>
        <td align="center">
          <img src="https://github.com/user-attachments/assets/f997aae8-0ec4-4e6c-931e-7ec3c06e7cb5" />
          <br>
          Halaman Tampilan hasil ekstraksi data dan data yang telah dikonfirmasi dalam bentuk google spreadsheet
        </td>
      </tr>
    </table>

5. **Ekspor Data**
   - Pengguna memiliki opsi untuk mengekspor data dari Google Spreadsheet dan menyimpan data tersebut ke dalam database. Fitur ini memungkinkan pengelolaan data yang lebih baik dan aksesibilitas di masa depan.
     <table align="center" style="border: none;">
      <tr>
        <td align="center">
          <img src="https://github.com/user-attachments/assets/17a91eda-9546-44b6-83db-9105bd287078" />
          <br>
          Halaman Tampilan hasil ekstraksi data dan data yang telah dikonfirmasi dalam bentuk google spreadsheet
        </td>
      </tr>
    </table>

## Teknologi yang Digunakan
- **Frontend**: Next.js, GoogleSheet API.
- **Backend**: FlaskAPI, Python Read SEGY, Python Read LAS
- **DevOps**: Docker

## Tujuan Proyek
Proyek ini bertujuan untuk menyediakan solusi yang efisien dalam katalogisasi dan pengelolaan data seismik, meningkatkan produktivitas pengguna dalam mengakses dan menganalisis data seismik dengan cara yang terstruktur.
