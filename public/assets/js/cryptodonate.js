document.getElementsByClassName("donate-eth")[0].onclick = function() {
  swal({
    title: "Donate with Ethereum",
    text: "Our Ethereum address is 0x61790B73A36223Bec8e1139c42f20E9466A08f7c",
    icon: "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=0x61790B73A36223Bec8e1139c42f20E9466A08f7c&chld=L|0"
  })
}