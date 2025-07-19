export default function Footer() {
  return (
    <footer className="bg-[hsl(210,24%,16%)] text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">VLGE INSTITUTE Pvt.Ltd</h3>
          <div className="space-y-1 text-sm text-gray-300">
            <p>An ISO 9001:2015 Certified Institute,</p>
            <p>Registered Company Under Govt of India (MCA & MSME),</p>
            <p>DPIIT Recognised Startup (Govt of India), Recognised by Startup TN and Approved by AICTE (Internships)</p>
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-300">
            <p>No 2/216 2D, Saibaba Nagar, K G Kandigai, Tiruttani TK, Tiruvallur District, Tamil Nadu - 631209</p>
            <p>Ph: +91 7708115754</p>
            <p className="space-x-2">
              Website: 
              <a href="http://www.valuelearn.in" className="text-[hsl(55,91%,72%)] hover:underline ml-1">
                www.valuelearn.in
              </a>
              <span className="mx-2">|</span>
              <a href="http://www.vlgegroups.com" className="text-[hsl(55,91%,72%)] hover:underline">
                www.vlgegroups.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
