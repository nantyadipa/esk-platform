export function generateWhatsAppURL(
  adminPhone: string,
  data: { name: string; phone: string; selectedClass: string; mode: string; referralCode?: string }
): string {
  const message = [
    `Halo, saya mau daftar kelas English Sepulang Kerja.`,
    `Nama: ${data.name}`,
    `No. HP: ${data.phone}`,
    `Kelas: ${data.selectedClass}`,
    `Mode: ${data.mode}`,
    `Kode Referral: ${data.referralCode || '-'}`,
  ].join('\n')

  const encodedPhone = adminPhone.replace(/[^0-9]/g, '')
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${encodedPhone}?text=${encodedMessage}`
}