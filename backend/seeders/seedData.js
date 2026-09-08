const { v4: uuidv4 } = require('uuid');

// Pre-generate certification IDs for foreign key references
const certIds = {
  ccna: uuidv4(),
  ccnp: uuidv4(),
  networkPlus: uuidv4(),
  securityPlus: uuidv4(),
  fortinet: uuidv4(),
  jncia: uuidv4(),
  mikrotik: uuidv4(),
  paloAlto: uuidv4(),
  generalNetworking: uuidv4(),
  networkSecurity: uuidv4(),
  linuxNetworking: uuidv4(),
  cloudNetworking: uuidv4(),
};

const certifications = [
  {
    id: certIds.ccna,
    name: 'Cisco CCNA',
    code: 'CCNA',
    description: 'Cisco Certified Network Associate — the most popular networking certification covering routing, switching, security, and automation fundamentals.',
    vendor: 'Cisco',
    level: 'beginner',
    icon: 'router',
    color: '#049fd9',
    examDuration: 120,
    passingScore: 825,
    slug: 'ccna',
    order: 1,
  },
  {
    id: certIds.ccnp,
    name: 'Cisco CCNP',
    code: 'CCNP',
    description: 'Cisco Certified Network Professional — advanced enterprise networking covering BGP, OSPF, SD-WAN, MPLS, and network design.',
    vendor: 'Cisco',
    level: 'advanced',
    icon: 'server',
    color: '#00bceb',
    examDuration: 120,
    passingScore: 825,
    slug: 'ccnp',
    order: 2,
  },
  {
    id: certIds.networkPlus,
    name: 'CompTIA Network+',
    code: 'NET+',
    description: 'Vendor-neutral networking certification covering networking concepts, infrastructure, operations, security, and troubleshooting.',
    vendor: 'CompTIA',
    level: 'beginner',
    icon: 'network',
    color: '#c8202f',
    examDuration: 90,
    passingScore: 720,
    slug: 'network-plus',
    order: 3,
  },
  {
    id: certIds.securityPlus,
    name: 'CompTIA Security+',
    code: 'SEC+',
    description: 'Industry-standard cybersecurity certification covering threats, vulnerabilities, cryptography, identity management, and risk.',
    vendor: 'CompTIA',
    level: 'intermediate',
    icon: 'shield',
    color: '#e31837',
    examDuration: 90,
    passingScore: 750,
    slug: 'security-plus',
    order: 4,
  },
  {
    id: certIds.fortinet,
    name: 'Fortinet NSE/FCP',
    code: 'FCP',
    description: 'Fortinet Network Security Expert — covering FortiGate, FortiManager, Security Fabric, SD-WAN, and enterprise security.',
    vendor: 'Fortinet',
    level: 'intermediate',
    icon: 'shield-check',
    color: '#ee3124',
    examDuration: 60,
    passingScore: 70,
    slug: 'fortinet',
    order: 5,
  },
  {
    id: certIds.jncia,
    name: 'Juniper JNCIA',
    code: 'JNCIA',
    description: 'Juniper Networks Certified Associate — covering Junos OS fundamentals, routing, switching, and network security.',
    vendor: 'Juniper',
    level: 'beginner',
    icon: 'cpu',
    color: '#00a4e4',
    examDuration: 90,
    passingScore: 60,
    slug: 'jncia',
    order: 6,
  },
  {
    id: certIds.mikrotik,
    name: 'MikroTik MTCNA',
    code: 'MTCNA',
    description: 'MikroTik Certified Network Associate — covering RouterOS, firewall, DHCP, bridging, routing, tunnels, and wireless.',
    vendor: 'MikroTik',
    level: 'beginner',
    icon: 'radio-tower',
    color: '#293239',
    examDuration: 60,
    passingScore: 60,
    slug: 'mikrotik',
    order: 7,
  },
  {
    id: certIds.paloAlto,
    name: 'Palo Alto PCNSA',
    code: 'PCNSA',
    description: 'Palo Alto Networks Certified Network Security Administrator — covering NGFW, security policies, GlobalProtect, and WildFire.',
    vendor: 'Palo Alto',
    level: 'intermediate',
    icon: 'flame',
    color: '#fa582d',
    examDuration: 80,
    passingScore: 70,
    slug: 'palo-alto',
    order: 8,
  },
  {
    id: certIds.generalNetworking,
    name: 'General Networking',
    code: 'GEN',
    description: 'Fundamental networking concepts — OSI model, TCP/IP, subnetting, DNS, DHCP, routing protocols, and network troubleshooting.',
    vendor: 'General',
    level: 'beginner',
    icon: 'globe',
    color: '#6366f1',
    examDuration: 60,
    passingScore: 70,
    slug: 'general-networking',
    order: 9,
  },
  {
    id: certIds.networkSecurity,
    name: 'Network Security',
    code: 'NSEC',
    description: 'Network security fundamentals — firewalls, IDS/IPS, VPN, encryption, PKI, access control, and security best practices.',
    vendor: 'General',
    level: 'intermediate',
    icon: 'lock',
    color: '#8b5cf6',
    examDuration: 60,
    passingScore: 70,
    slug: 'network-security',
    order: 10,
  },
  {
    id: certIds.linuxNetworking,
    name: 'Linux Networking',
    code: 'LNET',
    description: 'Linux networking — network configuration, iptables, routing, DNS, DHCP, network troubleshooting, and automation.',
    vendor: 'General',
    level: 'intermediate',
    icon: 'terminal',
    color: '#f59e0b',
    examDuration: 60,
    passingScore: 70,
    slug: 'linux-networking',
    order: 11,
  },
  {
    id: certIds.cloudNetworking,
    name: 'Cloud Networking',
    code: 'CNET',
    description: 'Cloud networking — VPC, subnets, load balancers, CDN, DNS, hybrid connectivity, and multi-cloud networking.',
    vendor: 'General',
    level: 'advanced',
    icon: 'cloud',
    color: '#06b6d4',
    examDuration: 60,
    passingScore: 70,
    slug: 'cloud-networking',
    order: 12,
  },
];

// Pre-generate topic IDs
const topicIds = {};
const topics = [];

function addTopics(certId, certCode, topicNames) {
  topicNames.forEach((name, i) => {
    const id = uuidv4();
    const key = `${certCode}_${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    topicIds[key] = id;
    topics.push({
      id,
      certificationId: certId,
      name,
      order: i + 1,
    });
  });
}

addTopics(certIds.ccna, 'CCNA', [
  'Networking Fundamentals', 'VLANs & Trunking', 'Spanning Tree Protocol',
  'EtherChannel', 'Routing Concepts', 'OSPF', 'EIGRP', 'Access Control Lists',
  'NAT & PAT', 'DHCP', 'IPv6', 'Wireless Networking', 'Network Security',
  'Network Automation',
]);

addTopics(certIds.ccnp, 'CCNP', [
  'Advanced OSPF', 'BGP', 'MPLS', 'SD-WAN', 'QoS', 'Network Design',
  'VPN Technologies', 'Multicast',
]);

addTopics(certIds.networkPlus, 'NET+', [
  'OSI Model', 'TCP/IP', 'Network Devices', 'IP Addressing & Subnetting',
  'DNS & DHCP', 'Wireless Technologies', 'Network Troubleshooting',
  'Cabling & Connectors', 'Network Services',
]);

addTopics(certIds.securityPlus, 'SEC+', [
  'Threats & Vulnerabilities', 'Cryptography', 'Identity & Access Management',
  'Security Operations', 'Risk Management', 'Network Security Architecture',
  'Incident Response',
]);

addTopics(certIds.fortinet, 'FCP', [
  'FortiGate Basics', 'Firewall Policies', 'NAT', 'VPN', 'Security Profiles',
  'SD-WAN', 'FortiManager', 'Security Fabric',
]);

addTopics(certIds.jncia, 'JNCIA', [
  'Junos OS Fundamentals', 'Routing Fundamentals', 'Switching',
  'Junos Security', 'Junos CLI',
]);

addTopics(certIds.mikrotik, 'MTCNA', [
  'RouterOS Basics', 'DHCP', 'Bridging', 'Routing', 'Firewall',
  'QoS', 'Tunnels', 'Wireless',
]);

addTopics(certIds.paloAlto, 'PCNSA', [
  'NGFW Fundamentals', 'Security Policies', 'NAT', 'App-ID',
  'Content-ID', 'GlobalProtect', 'WildFire', 'Panorama',
]);

addTopics(certIds.generalNetworking, 'GEN', [
  'OSI & TCP/IP Models', 'IP Addressing', 'Subnetting',
  'Routing Basics', 'Switching Basics', 'DNS', 'Network Protocols',
]);

addTopics(certIds.networkSecurity, 'NSEC', [
  'Firewalls', 'IDS/IPS', 'VPN', 'Encryption', 'PKI',
  'Access Control', 'Security Best Practices',
]);

addTopics(certIds.linuxNetworking, 'LNET', [
  'Network Configuration', 'iptables & nftables', 'Routing on Linux',
  'DNS Server', 'DHCP Server', 'Network Troubleshooting Tools',
]);

addTopics(certIds.cloudNetworking, 'CNET', [
  'Virtual Private Cloud', 'Load Balancing', 'CDN',
  'DNS in Cloud', 'Hybrid Connectivity', 'Multi-Cloud Networking',
]);

function getTopicId(certCode, topicPartial) {
  const key = Object.keys(topicIds).find(
    (k) => k.startsWith(certCode + '_') && k.includes(topicPartial.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_'))
  );
  return key ? topicIds[key] : null;
}

// ============================================================
// QUESTION BANK - 200+ Realistic Networking Questions
// ============================================================

const questions = [];

function addQ(certId, certCode, topicPartial, questionData) {
  const tId = getTopicId(certCode, topicPartial);
  if (!tId) {
    console.warn(`Topic not found: ${certCode} - ${topicPartial}`);
    return;
  }
  questions.push({
    id: uuidv4(),
    certificationId: certId,
    topicId: tId,
    ...questionData,
  });
}

// ─── CCNA QUESTIONS ───────────────────────────────────────────

// Networking Fundamentals
addQ(certIds.ccna, 'CCNA', 'networking_fundamentals', {
  questionCode: 'CCNA-FUN-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which layer of the OSI model is responsible for end-to-end communication and error recovery?',
  options: ['A. Network Layer', 'B. Data Link Layer', 'C. Transport Layer', 'D. Session Layer'],
  correctAnswer: 'C',
  explanation: 'The Transport Layer (Layer 4) provides end-to-end communication, error recovery, and flow control. TCP and UDP operate at this layer.',
});

addQ(certIds.ccna, 'CCNA', 'networking_fundamentals', {
  questionCode: 'CCNA-FUN-002',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What is the default subnet mask for a Class B IP address?',
  options: ['A. 255.0.0.0', 'B. 255.255.0.0', 'C. 255.255.255.0', 'D. 255.255.255.128'],
  correctAnswer: 'B',
  explanation: 'Class B IP addresses (128.0.0.0 to 191.255.255.255) have a default subnet mask of 255.255.0.0, providing 16 bits for the network and 16 bits for hosts.',
});

addQ(certIds.ccna, 'CCNA', 'networking_fundamentals', {
  questionCode: 'CCNA-FUN-003',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which protocol uses port 443 by default?',
  options: ['A. HTTP', 'B. HTTPS', 'C. FTP', 'D. SSH'],
  correctAnswer: 'B',
  explanation: 'HTTPS (HTTP Secure) uses TCP port 443 by default. It encrypts HTTP traffic using TLS/SSL encryption.',
});

addQ(certIds.ccna, 'CCNA', 'networking_fundamentals', {
  questionCode: 'CCNA-FUN-004',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What type of address is FF:FF:FF:FF:FF:FF?',
  options: ['A. Unicast MAC address', 'B. Multicast MAC address', 'C. Broadcast MAC address', 'D. Anycast MAC address'],
  correctAnswer: 'C',
  explanation: 'FF:FF:FF:FF:FF:FF is the broadcast MAC address. Frames sent to this address are delivered to all devices on the local network segment.',
});

addQ(certIds.ccna, 'CCNA', 'networking_fundamentals', {
  questionCode: 'CCNA-FUN-005',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which device operates at Layer 3 of the OSI model?',
  options: ['A. Hub', 'B. Switch', 'C. Router', 'D. Repeater'],
  correctAnswer: 'C',
  explanation: 'Routers operate at Layer 3 (Network Layer) of the OSI model. They make forwarding decisions based on IP addresses and can route between different networks.',
});

// VLANs & Trunking
addQ(certIds.ccna, 'CCNA', 'vlans', {
  questionCode: 'CCNA-VLAN-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What is the default VLAN on a Cisco switch?',
  options: ['A. VLAN 0', 'B. VLAN 1', 'C. VLAN 100', 'D. VLAN 1002'],
  correctAnswer: 'B',
  explanation: 'VLAN 1 is the default VLAN on Cisco switches. All ports are assigned to VLAN 1 by default. It cannot be deleted or renamed.',
});

addQ(certIds.ccna, 'CCNA', 'vlans', {
  questionCode: 'CCNA-VLAN-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which protocol is used for VLAN trunking on Cisco switches?',
  options: ['A. ISL only', 'B. 802.1Q only', 'C. Both ISL and 802.1Q', 'D. VTP'],
  correctAnswer: 'C',
  explanation: 'Cisco supports both ISL (Inter-Switch Link) and IEEE 802.1Q for VLAN trunking. 802.1Q is the industry standard and more commonly used. ISL is Cisco proprietary.',
});

addQ(certIds.ccna, 'CCNA', 'vlans', {
  questionCode: 'CCNA-VLAN-003',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What happens when a switch receives an untagged frame on a trunk port?',
  options: [
    'A. The frame is dropped',
    'B. The frame is assigned to the native VLAN',
    'C. The frame is flooded to all VLANs',
    'D. The frame is sent back to the source',
  ],
  correctAnswer: 'B',
  explanation: 'Untagged frames received on a trunk port are assigned to the native VLAN. By default, the native VLAN is VLAN 1. It is a security best practice to change the native VLAN.',
});

addQ(certIds.ccna, 'CCNA', 'vlans', {
  questionCode: 'CCNA-VLAN-004',
  type: 'cli_output',
  difficulty: 'medium',
  questionText: 'Based on the following output, which VLAN is configured as the native VLAN on this trunk?\n\nSwitch#show interfaces trunk\nPort    Mode    Encapsulation  Status     Native vlan\nGi0/1   on      802.1q         trunking   99',
  options: ['A. VLAN 1', 'B. VLAN 99', 'C. VLAN 0', 'D. No native VLAN is configured'],
  correctAnswer: 'B',
  explanation: 'The output shows "Native vlan 99", indicating VLAN 99 is configured as the native VLAN on trunk port Gi0/1.',
});

// Spanning Tree Protocol
addQ(certIds.ccna, 'CCNA', 'spanning_tree', {
  questionCode: 'CCNA-STP-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the primary purpose of Spanning Tree Protocol (STP)?',
  options: [
    'A. To increase bandwidth between switches',
    'B. To prevent Layer 2 loops',
    'C. To provide redundant default gateways',
    'D. To encrypt traffic between switches',
  ],
  correctAnswer: 'B',
  explanation: 'STP (IEEE 802.1D) prevents Layer 2 loops in networks with redundant paths by blocking redundant ports while maintaining a loop-free topology.',
});

addQ(certIds.ccna, 'CCNA', 'spanning_tree', {
  questionCode: 'CCNA-STP-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which STP port state allows a port to send and receive data frames?',
  options: ['A. Blocking', 'B. Listening', 'C. Learning', 'D. Forwarding'],
  correctAnswer: 'D',
  explanation: 'In the Forwarding state, a port sends and receives data frames, learns MAC addresses, and processes BPDUs. This is the only state where actual data traffic is forwarded.',
});

addQ(certIds.ccna, 'CCNA', 'spanning_tree', {
  questionCode: 'CCNA-STP-003',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'In RSTP (802.1w), which port role replaces the non-designated port of classic STP?',
  options: ['A. Backup port', 'B. Alternate port', 'C. Edge port', 'D. Root port'],
  correctAnswer: 'B',
  explanation: 'In RSTP, the alternate port replaces the non-designated (blocking) port from classic STP. The alternate port provides an alternative path to the root bridge.',
});

// EtherChannel
addQ(certIds.ccna, 'CCNA', 'etherchannel', {
  questionCode: 'CCNA-EC-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which EtherChannel negotiation protocol is Cisco proprietary?',
  options: ['A. LACP', 'B. PAgP', 'C. Static', 'D. STP'],
  correctAnswer: 'B',
  explanation: 'PAgP (Port Aggregation Protocol) is Cisco proprietary. LACP (Link Aggregation Control Protocol, IEEE 802.3ad) is the industry standard alternative.',
});

addQ(certIds.ccna, 'CCNA', 'etherchannel', {
  questionCode: 'CCNA-EC-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the maximum number of active links in a LACP EtherChannel?',
  options: ['A. 2', 'B. 4', 'C. 8', 'D. 16'],
  correctAnswer: 'C',
  explanation: 'LACP supports up to 16 links in an EtherChannel bundle, but only 8 can be active at a time. The remaining 8 are in standby mode for redundancy.',
});

// Routing Concepts
addQ(certIds.ccna, 'CCNA', 'routing_concepts', {
  questionCode: 'CCNA-RT-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What is the administrative distance of a directly connected route?',
  options: ['A. 0', 'B. 1', 'C. 5', 'D. 20'],
  correctAnswer: 'A',
  explanation: 'Directly connected routes have an administrative distance (AD) of 0, making them the most trusted route source. Static routes have an AD of 1.',
});

addQ(certIds.ccna, 'CCNA', 'routing_concepts', {
  questionCode: 'CCNA-RT-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which routing protocol is a link-state protocol?',
  options: ['A. RIPv2', 'B. EIGRP', 'C. OSPF', 'D. BGP'],
  correctAnswer: 'C',
  explanation: 'OSPF is a link-state routing protocol. It uses Dijkstra\'s SPF algorithm to calculate the shortest path. RIP is distance-vector, EIGRP is advanced distance-vector, and BGP is path-vector.',
});

addQ(certIds.ccna, 'CCNA', 'routing_concepts', {
  questionCode: 'CCNA-RT-003',
  type: 'cli_output',
  difficulty: 'medium',
  questionText: 'Examine the routing table output below. What does the "O" code represent?\n\nR1#show ip route\nO    10.10.20.0/24 [110/2] via 10.1.1.2, 00:05:23, GigabitEthernet0/1',
  options: ['A. Static route', 'B. OSPF route', 'C. EIGRP route', 'D. Connected route'],
  correctAnswer: 'B',
  explanation: 'The code "O" in a Cisco routing table represents an OSPF-learned route. The [110/2] shows the administrative distance (110) and cost metric (2).',
});

// OSPF
addQ(certIds.ccna, 'CCNA', 'ospf', {
  questionCode: 'CCNA-OSPF-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which OSPF packet type is used to establish and maintain neighbor relationships?',
  options: ['A. LSA', 'B. Hello', 'C. DBD', 'D. LSR'],
  correctAnswer: 'B',
  explanation: 'OSPF Hello packets are used to discover neighbors and maintain neighbor relationships. They are sent every 10 seconds on broadcast networks and every 30 seconds on NBMA networks.',
});

addQ(certIds.ccna, 'CCNA', 'ospf', {
  questionCode: 'CCNA-OSPF-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the default OSPF Hello interval on a broadcast network?',
  options: ['A. 5 seconds', 'B. 10 seconds', 'C. 30 seconds', 'D. 40 seconds'],
  correctAnswer: 'B',
  explanation: 'The default OSPF Hello interval on broadcast and point-to-point networks is 10 seconds. The Dead interval is 4 times the Hello interval (40 seconds by default).',
});

addQ(certIds.ccna, 'CCNA', 'ospf', {
  questionCode: 'CCNA-OSPF-003',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'Which OSPF router ID selection method has the highest priority?',
  options: [
    'A. Highest IP address on any active interface',
    'B. Highest loopback IP address',
    'C. Manually configured router ID',
    'D. Lowest physical interface IP address',
  ],
  correctAnswer: 'C',
  explanation: 'OSPF router ID selection priority: 1) Manually configured router ID (highest), 2) Highest loopback IP address, 3) Highest IP address on any active physical interface.',
});

addQ(certIds.ccna, 'CCNA', 'ospf', {
  questionCode: 'CCNA-OSPF-004',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What multicast address does OSPF use to send Hello packets to all OSPF routers?',
  options: ['A. 224.0.0.1', 'B. 224.0.0.5', 'C. 224.0.0.6', 'D. 224.0.0.9'],
  correctAnswer: 'B',
  explanation: '224.0.0.5 is the "All OSPF Routers" multicast address. 224.0.0.6 is used for DR/BDR communication. These are link-local multicast addresses (not routed).',
});

// EIGRP
addQ(certIds.ccna, 'CCNA', 'eigrp', {
  questionCode: 'CCNA-EIGRP-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the administrative distance of an internal EIGRP route?',
  options: ['A. 20', 'B. 90', 'C. 110', 'D. 170'],
  correctAnswer: 'B',
  explanation: 'Internal EIGRP routes have an AD of 90. External EIGRP routes (redistributed into EIGRP) have an AD of 170.',
});

addQ(certIds.ccna, 'CCNA', 'eigrp', {
  questionCode: 'CCNA-EIGRP-002',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'Which EIGRP component provides loop-free backup routes?',
  options: ['A. Successor route', 'B. Feasible successor', 'C. Reported distance', 'D. Feasible distance'],
  correctAnswer: 'B',
  explanation: 'A Feasible Successor is a backup route that meets the feasibility condition (reported distance < feasible distance of the successor). It provides instant convergence without querying neighbors.',
});

// ACLs
addQ(certIds.ccna, 'CCNA', 'access_control', {
  questionCode: 'CCNA-ACL-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What is the number range for standard ACLs on a Cisco router?',
  options: ['A. 1-99', 'B. 100-199', 'C. 200-299', 'D. 1300-1999'],
  correctAnswer: 'A',
  explanation: 'Standard ACLs use numbers 1-99 (and extended range 1300-1999). Extended ACLs use numbers 100-199 (and extended range 2000-2699).',
});

addQ(certIds.ccna, 'CCNA', 'access_control', {
  questionCode: 'CCNA-ACL-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the implicit rule at the end of every ACL?',
  options: [
    'A. permit any',
    'B. deny any',
    'C. permit host',
    'D. No implicit rule exists',
  ],
  correctAnswer: 'B',
  explanation: 'Every ACL has an implicit "deny any" (deny all) at the end. If traffic does not match any explicit ACL entry, it is denied by this implicit rule.',
});

addQ(certIds.ccna, 'CCNA', 'access_control', {
  questionCode: 'CCNA-ACL-003',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Where should a standard ACL be placed?',
  options: [
    'A. Close to the source',
    'B. Close to the destination',
    'C. On the core router',
    'D. On the distribution switch',
  ],
  correctAnswer: 'B',
  explanation: 'Standard ACLs should be placed as close to the destination as possible because they filter based only on source IP address. Placing them too close to the source may block legitimate traffic.',
});

// NAT/PAT
addQ(certIds.ccna, 'CCNA', 'nat', {
  questionCode: 'CCNA-NAT-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What type of NAT maps multiple private IP addresses to a single public IP address using port numbers?',
  options: ['A. Static NAT', 'B. Dynamic NAT', 'C. PAT (NAT Overload)', 'D. NAT64'],
  correctAnswer: 'C',
  explanation: 'PAT (Port Address Translation), also called NAT Overload, maps multiple private IPs to a single public IP by tracking unique source port numbers for each connection.',
});

addQ(certIds.ccna, 'CCNA', 'nat', {
  questionCode: 'CCNA-NAT-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'In NAT terminology, what is the "inside local" address?',
  options: [
    'A. The private IP address of the internal host',
    'B. The public IP address assigned to the internal host',
    'C. The public IP address of the external server',
    'D. The private IP address of the external server',
  ],
  correctAnswer: 'A',
  explanation: 'Inside Local is the private IP address of an internal host before NAT translation. Inside Global is the public IP after translation. Outside Global is the real public IP of the external host.',
});

// DHCP
addQ(certIds.ccna, 'CCNA', 'dhcp', {
  questionCode: 'CCNA-DHCP-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What is the correct order of DHCP messages when a client obtains an IP address?',
  options: [
    'A. Discover, Offer, Request, Acknowledge',
    'B. Request, Offer, Discover, Acknowledge',
    'C. Offer, Discover, Acknowledge, Request',
    'D. Discover, Request, Offer, Acknowledge',
  ],
  correctAnswer: 'A',
  explanation: 'DHCP uses the DORA process: Discover (client broadcasts), Offer (server responds), Request (client accepts), Acknowledge (server confirms). This is a four-way handshake.',
});

addQ(certIds.ccna, 'CCNA', 'dhcp', {
  questionCode: 'CCNA-DHCP-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which command is used to relay DHCP requests to a server on a different subnet?',
  options: [
    'A. ip dhcp pool',
    'B. ip helper-address',
    'C. ip dhcp relay',
    'D. ip forward-protocol',
  ],
  correctAnswer: 'B',
  explanation: 'The "ip helper-address" command is configured on the router interface facing the DHCP clients. It relays DHCP broadcasts as unicast packets to the DHCP server on another subnet.',
});

// IPv6
addQ(certIds.ccna, 'CCNA', 'ipv6', {
  questionCode: 'CCNA-IPV6-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'How many bits are in an IPv6 address?',
  options: ['A. 32 bits', 'B. 64 bits', 'C. 128 bits', 'D. 256 bits'],
  correctAnswer: 'C',
  explanation: 'IPv6 addresses are 128 bits long, written as eight groups of four hexadecimal digits separated by colons (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334).',
});

addQ(certIds.ccna, 'CCNA', 'ipv6', {
  questionCode: 'CCNA-IPV6-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which IPv6 address type is equivalent to a private IPv4 address?',
  options: ['A. Link-local', 'B. Unique Local (ULA)', 'C. Global Unicast', 'D. Multicast'],
  correctAnswer: 'B',
  explanation: 'Unique Local Addresses (ULA) in IPv6 (fc00::/7) are similar to private IPv4 addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). They are not routable on the public internet.',
});

addQ(certIds.ccna, 'CCNA', 'ipv6', {
  questionCode: 'CCNA-IPV6-003',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the IPv6 link-local address prefix?',
  options: ['A. 2001::/16', 'B. FE80::/10', 'C. FC00::/7', 'D. FF00::/8'],
  correctAnswer: 'B',
  explanation: 'IPv6 link-local addresses use the prefix FE80::/10. They are automatically configured on every IPv6-enabled interface and are not routable beyond the local link.',
});

// Wireless
addQ(certIds.ccna, 'CCNA', 'wireless', {
  questionCode: 'CCNA-WLAN-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which Wi-Fi standard operates only in the 5 GHz frequency band?',
  options: ['A. 802.11b', 'B. 802.11g', 'C. 802.11a', 'D. 802.11n'],
  correctAnswer: 'C',
  explanation: '802.11a operates exclusively in the 5 GHz band. 802.11b and 802.11g operate in 2.4 GHz. 802.11n (Wi-Fi 4) operates in both 2.4 GHz and 5 GHz.',
});

addQ(certIds.ccna, 'CCNA', 'wireless', {
  questionCode: 'CCNA-WLAN-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the strongest wireless security protocol currently recommended?',
  options: ['A. WEP', 'B. WPA', 'C. WPA2', 'D. WPA3'],
  correctAnswer: 'D',
  explanation: 'WPA3 is the latest and strongest wireless security protocol. It uses SAE (Simultaneous Authentication of Equals) handshake and 192-bit security for enterprise mode.',
});

// Network Security
addQ(certIds.ccna, 'CCNA', 'network_security', {
  questionCode: 'CCNA-SEC-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which security feature limits the number of MAC addresses learned on a switch port?',
  options: ['A. ACL', 'B. Port Security', 'C. DHCP Snooping', 'D. ARP Inspection'],
  correctAnswer: 'B',
  explanation: 'Port Security limits the number of valid MAC addresses allowed on a port. Violation actions include protect, restrict, and shutdown (default).',
});

addQ(certIds.ccna, 'CCNA', 'network_security', {
  questionCode: 'CCNA-SEC-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What attack does DHCP snooping primarily prevent?',
  options: ['A. MAC flooding', 'B. ARP spoofing', 'C. Rogue DHCP server', 'D. DNS poisoning'],
  correctAnswer: 'C',
  explanation: 'DHCP snooping creates a trusted/untrusted port model to prevent rogue DHCP servers from assigning incorrect IP configuration to clients.',
});

// Network Automation
addQ(certIds.ccna, 'CCNA', 'network_automation', {
  questionCode: 'CCNA-AUTO-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which data format is most commonly used with REST APIs in network automation?',
  options: ['A. XML', 'B. JSON', 'C. YAML', 'D. CSV'],
  correctAnswer: 'B',
  explanation: 'JSON (JavaScript Object Notation) is the most widely used data format for REST APIs. It is lightweight, human-readable, and easy to parse programmatically.',
});

// ─── CCNP QUESTIONS ───────────────────────────────────────────

addQ(certIds.ccnp, 'CCNP', 'advanced_ospf', {
  questionCode: 'CCNP-OSPF-001',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'Which OSPF LSA type describes external routes redistributed into OSPF by an ASBR?',
  options: ['A. Type 1 (Router LSA)', 'B. Type 3 (Summary LSA)', 'C. Type 5 (External LSA)', 'D. Type 7 (NSSA External LSA)'],
  correctAnswer: 'C',
  explanation: 'Type 5 LSAs are generated by ASBRs to describe routes redistributed into OSPF from external routing domains. They are flooded throughout the OSPF domain except into stub areas.',
});

addQ(certIds.ccnp, 'CCNP', 'advanced_ospf', {
  questionCode: 'CCNP-OSPF-002',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'What is the purpose of OSPF area 0 (backbone area)?',
  options: [
    'A. To connect external networks',
    'B. To serve as transit area between other areas',
    'C. To reduce LSA flooding',
    'D. To summarize routes',
  ],
  correctAnswer: 'B',
  explanation: 'OSPF Area 0 (backbone) is the transit area. All other areas must connect to Area 0 (directly or via virtual links). Inter-area traffic must traverse the backbone.',
});

addQ(certIds.ccnp, 'CCNP', 'bgp', {
  questionCode: 'CCNP-BGP-001',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'What is the primary function of BGP in internet routing?',
  options: [
    'A. Route within an autonomous system',
    'B. Route between autonomous systems',
    'C. Provide DHCP services',
    'D. Manage VLAN assignments',
  ],
  correctAnswer: 'B',
  explanation: 'BGP (Border Gateway Protocol) is the internet\'s exterior gateway protocol. It routes traffic between autonomous systems (ASes) and is the protocol that makes the internet work.',
});

addQ(certIds.ccnp, 'CCNP', 'bgp', {
  questionCode: 'CCNP-BGP-002',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'Which BGP attribute is used first in the best path selection process?',
  options: ['A. Local Preference', 'B. AS Path', 'C. Weight', 'D. MED'],
  correctAnswer: 'C',
  explanation: 'Weight is the first attribute checked in BGP best path selection (Cisco proprietary, local to the router). The order is: Weight > Local Preference > Originate > AS Path length > Origin > MED > eBGP > IGP metric > Router ID.',
});

addQ(certIds.ccnp, 'CCNP', 'bgp', {
  questionCode: 'CCNP-BGP-003',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'What TCP port does BGP use?',
  options: ['A. 23', 'B. 80', 'C. 161', 'D. 179'],
  correctAnswer: 'D',
  explanation: 'BGP uses TCP port 179 for establishing peer sessions. BGP is the only major routing protocol that uses TCP for reliable communication between peers.',
});

addQ(certIds.ccnp, 'CCNP', 'mpls', {
  questionCode: 'CCNP-MPLS-001',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'What is the size of an MPLS label?',
  options: ['A. 16 bits', 'B. 20 bits', 'C. 24 bits', 'D. 32 bits'],
  correctAnswer: 'D',
  explanation: 'An MPLS label is 32 bits total: 20-bit label value, 3-bit experimental (QoS), 1-bit bottom of stack indicator, and 8-bit TTL field.',
});

addQ(certIds.ccnp, 'CCNP', 'sd_wan', {
  questionCode: 'CCNP-SDWAN-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which component in Cisco SD-WAN is responsible for centralized policy management?',
  options: ['A. vEdge', 'B. vSmart', 'C. vManage', 'D. vBond'],
  correctAnswer: 'C',
  explanation: 'vManage is the centralized management and monitoring platform for Cisco SD-WAN. vSmart controls routing policy, vBond orchestrates authentication, and vEdge/cEdge are the WAN edge routers.',
});

addQ(certIds.ccnp, 'CCNP', 'qos', {
  questionCode: 'CCNP-QOS-001',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'Which QoS mechanism ensures that voice traffic receives priority over data traffic?',
  options: ['A. FIFO', 'B. WFQ', 'C. LLQ', 'D. CBWFQ'],
  correctAnswer: 'C',
  explanation: 'LLQ (Low Latency Queuing) provides a priority queue for delay-sensitive traffic like voice and video. It combines CBWFQ with a strict priority queue.',
});

// ─── NETWORK+ QUESTIONS ──────────────────────────────────────

addQ(certIds.networkPlus, 'NET+', 'osi_model', {
  questionCode: 'NET-OSI-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which OSI layer is responsible for logical addressing and routing?',
  options: ['A. Layer 1 - Physical', 'B. Layer 2 - Data Link', 'C. Layer 3 - Network', 'D. Layer 4 - Transport'],
  correctAnswer: 'C',
  explanation: 'Layer 3 (Network) handles logical addressing (IP addresses) and routing. It determines the best path for data to travel from source to destination across networks.',
});

addQ(certIds.networkPlus, 'NET+', 'osi_model', {
  questionCode: 'NET-OSI-002',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What are the layers of the OSI model from bottom to top?',
  options: [
    'A. Physical, Data Link, Network, Transport, Session, Presentation, Application',
    'B. Application, Presentation, Session, Transport, Network, Data Link, Physical',
    'C. Physical, Network, Data Link, Transport, Session, Application, Presentation',
    'D. Physical, Data Link, Transport, Network, Session, Presentation, Application',
  ],
  correctAnswer: 'A',
  explanation: 'The OSI model layers from bottom to top: Physical (L1), Data Link (L2), Network (L3), Transport (L4), Session (L5), Presentation (L6), Application (L7). Remember: "Please Do Not Throw Sausage Pizza Away".',
});

addQ(certIds.networkPlus, 'NET+', 'tcp_ip', {
  questionCode: 'NET-TCP-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What is the TCP three-way handshake sequence?',
  options: ['A. SYN, ACK, FIN', 'B. SYN, SYN-ACK, ACK', 'C. ACK, SYN, FIN', 'D. SYN, ACK, SYN'],
  correctAnswer: 'B',
  explanation: 'TCP three-way handshake: 1) Client sends SYN, 2) Server responds with SYN-ACK, 3) Client sends ACK. This establishes a reliable connection before data transfer.',
});

addQ(certIds.networkPlus, 'NET+', 'tcp_ip', {
  questionCode: 'NET-TCP-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which transport protocol provides connectionless, unreliable delivery?',
  options: ['A. TCP', 'B. UDP', 'C. SCTP', 'D. ICMP'],
  correctAnswer: 'B',
  explanation: 'UDP (User Datagram Protocol) is connectionless and does not guarantee delivery. It is faster than TCP and used for real-time applications like VoIP, streaming, and DNS queries.',
});

addQ(certIds.networkPlus, 'NET+', 'network_devices', {
  questionCode: 'NET-DEV-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which device connects different networks and makes forwarding decisions based on IP addresses?',
  options: ['A. Hub', 'B. Switch', 'C. Router', 'D. Access Point'],
  correctAnswer: 'C',
  explanation: 'A router connects different networks and forwards packets based on IP addresses (Layer 3). Switches forward based on MAC addresses (Layer 2). Hubs broadcast to all ports (Layer 1).',
});

addQ(certIds.networkPlus, 'NET+', 'ip_addressing', {
  questionCode: 'NET-IP-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'How many usable host addresses are in a /26 subnet?',
  options: ['A. 30', 'B. 62', 'C. 64', 'D. 126'],
  correctAnswer: 'B',
  explanation: 'A /26 subnet has 6 host bits (32 - 26 = 6). Total addresses = 2^6 = 64. Usable hosts = 64 - 2 = 62 (subtracting network and broadcast addresses).',
});

addQ(certIds.networkPlus, 'NET+', 'ip_addressing', {
  questionCode: 'NET-IP-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which of the following is a valid private IPv4 address range?',
  options: ['A. 172.32.0.0/12', 'B. 192.168.0.0/16', 'C. 10.0.0.0/8', 'D. 169.254.0.0/16'],
  correctAnswer: 'C',
  explanation: 'RFC 1918 private address ranges: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. 169.254.0.0/16 is APIPA (link-local), not a private range.',
});

addQ(certIds.networkPlus, 'NET+', 'dns', {
  questionCode: 'NET-DNS-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which DNS record type maps a domain name to an IPv4 address?',
  options: ['A. AAAA', 'B. A', 'C. MX', 'D. CNAME'],
  correctAnswer: 'B',
  explanation: 'An A (Address) record maps a domain name to an IPv4 address. AAAA records map to IPv6. MX records point to mail servers. CNAME records create aliases.',
});

addQ(certIds.networkPlus, 'NET+', 'wireless_technologies', {
  questionCode: 'NET-WLAN-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which Wi-Fi standard is also known as Wi-Fi 6?',
  options: ['A. 802.11ac', 'B. 802.11ax', 'C. 802.11n', 'D. 802.11be'],
  correctAnswer: 'B',
  explanation: '802.11ax is Wi-Fi 6, offering improved performance in dense environments with OFDMA and MU-MIMO. 802.11ac is Wi-Fi 5, 802.11n is Wi-Fi 4, and 802.11be is Wi-Fi 7.',
});

addQ(certIds.networkPlus, 'NET+', 'network_troubleshooting', {
  questionCode: 'NET-TSHOOT-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which command is used to test connectivity between two hosts?',
  options: ['A. tracert', 'B. ping', 'C. nslookup', 'D. netstat'],
  correctAnswer: 'B',
  explanation: 'The ping command uses ICMP Echo Request and Echo Reply messages to test basic connectivity between two hosts. It also measures round-trip time (RTT).',
});

addQ(certIds.networkPlus, 'NET+', 'cabling', {
  questionCode: 'NET-CAB-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What is the maximum cable length for Cat6 Ethernet at 1 Gbps?',
  options: ['A. 55 meters', 'B. 100 meters', 'C. 150 meters', 'D. 300 meters'],
  correctAnswer: 'B',
  explanation: 'Cat6 cable supports 1 Gbps up to 100 meters (328 feet). For 10 Gbps, Cat6 is limited to 55 meters, while Cat6a supports 10 Gbps up to 100 meters.',
});

// ─── SECURITY+ QUESTIONS ─────────────────────────────────────

addQ(certIds.securityPlus, 'SEC+', 'threats', {
  questionCode: 'SEC-THR-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which type of attack floods a target with traffic to make it unavailable?',
  options: ['A. Phishing', 'B. Man-in-the-Middle', 'C. DDoS', 'D. SQL Injection'],
  correctAnswer: 'C',
  explanation: 'A DDoS (Distributed Denial of Service) attack overwhelms a target with traffic from multiple sources, making legitimate services unavailable to users.',
});

addQ(certIds.securityPlus, 'SEC+', 'threats', {
  questionCode: 'SEC-THR-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What type of malware encrypts files and demands payment for decryption?',
  options: ['A. Trojan', 'B. Worm', 'C. Ransomware', 'D. Adware'],
  correctAnswer: 'C',
  explanation: 'Ransomware encrypts the victim\'s files and demands a ransom payment (usually in cryptocurrency) for the decryption key. Examples include WannaCry and NotPetya.',
});

addQ(certIds.securityPlus, 'SEC+', 'threats', {
  questionCode: 'SEC-THR-003',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which social engineering attack creates a fabricated scenario to obtain information?',
  options: ['A. Phishing', 'B. Pretexting', 'C. Baiting', 'D. Tailgating'],
  correctAnswer: 'B',
  explanation: 'Pretexting involves creating a fabricated scenario (pretext) to engage a victim and obtain sensitive information or access. The attacker pretends to need the information for a legitimate purpose.',
});

addQ(certIds.securityPlus, 'SEC+', 'cryptography', {
  questionCode: 'SEC-CRYPT-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which encryption algorithm uses the same key for encryption and decryption?',
  options: ['A. RSA', 'B. AES', 'C. Diffie-Hellman', 'D. ECC'],
  correctAnswer: 'B',
  explanation: 'AES (Advanced Encryption Standard) is a symmetric encryption algorithm — the same key encrypts and decrypts data. RSA, Diffie-Hellman, and ECC are asymmetric (public/private key pairs).',
});

addQ(certIds.securityPlus, 'SEC+', 'cryptography', {
  questionCode: 'SEC-CRYPT-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the purpose of a hash function in cryptography?',
  options: [
    'A. Encrypt data for confidentiality',
    'B. Create a fixed-size fingerprint of data for integrity verification',
    'C. Generate encryption keys',
    'D. Authenticate users',
  ],
  correctAnswer: 'B',
  explanation: 'A hash function creates a fixed-size output (digest/fingerprint) from input data. It verifies data integrity — any change in input produces a completely different hash. Examples: SHA-256, MD5.',
});

addQ(certIds.securityPlus, 'SEC+', 'cryptography', {
  questionCode: 'SEC-CRYPT-003',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'Which TLS version is considered the current secure standard?',
  options: ['A. TLS 1.0', 'B. TLS 1.1', 'C. TLS 1.2', 'D. TLS 1.3'],
  correctAnswer: 'D',
  explanation: 'TLS 1.3 is the current standard, offering improved security and performance. TLS 1.0 and 1.1 are deprecated. TLS 1.3 reduces handshake latency and removes vulnerable cipher suites.',
});

addQ(certIds.securityPlus, 'SEC+', 'identity', {
  questionCode: 'SEC-IAM-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What does multi-factor authentication (MFA) require?',
  options: [
    'A. Multiple passwords',
    'B. Two or more different types of authentication factors',
    'C. Biometric authentication only',
    'D. A smart card and PIN only',
  ],
  correctAnswer: 'B',
  explanation: 'MFA requires two or more different types of factors: something you know (password), something you have (token/phone), something you are (biometric). Using two passwords is NOT MFA.',
});

addQ(certIds.securityPlus, 'SEC+', 'security_operations', {
  questionCode: 'SEC-OPS-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is a SIEM system used for?',
  options: [
    'A. Network packet filtering',
    'B. Security event logging, correlation, and analysis',
    'C. Endpoint antivirus protection',
    'D. Data loss prevention',
  ],
  correctAnswer: 'B',
  explanation: 'SIEM (Security Information and Event Management) collects, correlates, and analyzes security events from multiple sources to detect threats and support incident response.',
});

addQ(certIds.securityPlus, 'SEC+', 'risk_management', {
  questionCode: 'SEC-RISK-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What risk response strategy involves transferring the risk to a third party?',
  options: ['A. Mitigation', 'B. Acceptance', 'C. Transference', 'D. Avoidance'],
  correctAnswer: 'C',
  explanation: 'Risk transference shifts the financial burden of a risk to a third party, typically through insurance or outsourcing. The organization doesn\'t eliminate the risk but transfers its impact.',
});

addQ(certIds.securityPlus, 'SEC+', 'network_security_arch', {
  questionCode: 'SEC-ARCH-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is a DMZ (Demilitarized Zone) in network security?',
  options: [
    'A. An internal network segment for employees',
    'B. A network segment between internal and external networks for public-facing services',
    'C. A backup network for disaster recovery',
    'D. A wireless network segment',
  ],
  correctAnswer: 'B',
  explanation: 'A DMZ is a network segment that sits between the internal (trusted) and external (untrusted) networks. It hosts public-facing services like web servers and email servers.',
});

// ─── FORTINET QUESTIONS ──────────────────────────────────────

addQ(certIds.fortinet, 'FCP', 'fortigate_basics', {
  questionCode: 'FCP-FG-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the default management port for FortiGate web-based management?',
  options: ['A. Port 80', 'B. Port 443', 'C. Port 8443', 'D. Port 22'],
  correctAnswer: 'B',
  explanation: 'FortiGate uses HTTPS (port 443) for web-based management by default. The management interface can be accessed via https://<management-ip>.',
});

addQ(certIds.fortinet, 'FCP', 'firewall_policies', {
  questionCode: 'FCP-FW-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'In FortiGate, how are firewall policies processed?',
  options: [
    'A. Alphabetically by name',
    'B. By policy ID number',
    'C. Top-down, first match wins',
    'D. Most specific first',
  ],
  correctAnswer: 'C',
  explanation: 'FortiGate processes firewall policies in a top-down order. The first matching policy is applied to the traffic, so policy order is crucial. An implicit deny exists at the bottom.',
});

addQ(certIds.fortinet, 'FCP', 'nat', {
  questionCode: 'FCP-NAT-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which FortiGate feature provides source NAT for outbound traffic?',
  options: ['A. Central NAT', 'B. IP Pool', 'C. Virtual IP (VIP)', 'D. Policy-based NAT'],
  correctAnswer: 'B',
  explanation: 'IP Pools in FortiGate provide source NAT for outbound traffic. VIPs (Virtual IPs) are used for destination NAT (DNAT) for inbound traffic.',
});

addQ(certIds.fortinet, 'FCP', 'vpn', {
  questionCode: 'FCP-VPN-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which VPN type is typically used for site-to-site connections in FortiGate?',
  options: ['A. SSL VPN', 'B. IPsec VPN', 'C. PPTP VPN', 'D. L2TP VPN'],
  correctAnswer: 'B',
  explanation: 'IPsec VPN is the standard for site-to-site connections. SSL VPN is typically used for remote access (client-to-site). IPsec provides both encryption and authentication.',
});

addQ(certIds.fortinet, 'FCP', 'security_profiles', {
  questionCode: 'FCP-SP-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which FortiGate security profile inspects web traffic for threats?',
  options: ['A. Antivirus', 'B. Web Filter', 'C. Application Control', 'D. All of the above'],
  correctAnswer: 'D',
  explanation: 'FortiGate uses multiple security profiles for web traffic inspection: Antivirus (malware), Web Filter (URL categories), and Application Control (application identification). They work together for comprehensive protection.',
});

addQ(certIds.fortinet, 'FCP', 'sd_wan', {
  questionCode: 'FCP-SDWAN-001',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'What metric does FortiGate SD-WAN use for health checks?',
  options: [
    'A. Bandwidth only',
    'B. Latency, jitter, and packet loss',
    'C. Hop count',
    'D. Link speed',
  ],
  correctAnswer: 'B',
  explanation: 'FortiGate SD-WAN health checks measure latency, jitter, and packet loss to determine link quality and make intelligent routing decisions based on SLA (Service Level Agreement) rules.',
});

// ─── JNCIA QUESTIONS ─────────────────────────────────────────

addQ(certIds.jncia, 'JNCIA', 'junos_os', {
  questionCode: 'JNCIA-OS-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which Junos CLI mode allows configuration changes?',
  options: ['A. Operational mode', 'B. Configuration mode', 'C. Shell mode', 'D. Monitor mode'],
  correctAnswer: 'B',
  explanation: 'Junos Configuration mode (accessed via "configure" or "edit") allows changes to the device configuration. Operational mode is for monitoring and troubleshooting.',
});

addQ(certIds.jncia, 'JNCIA', 'junos_os', {
  questionCode: 'JNCIA-OS-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'In Junos, what command applies configuration changes?',
  options: ['A. write memory', 'B. copy running-config startup-config', 'C. commit', 'D. save'],
  correctAnswer: 'C',
  explanation: 'In Junos OS, the "commit" command activates configuration changes. Unlike Cisco IOS, Junos uses a candidate/active configuration model where changes must be committed.',
});

addQ(certIds.jncia, 'JNCIA', 'routing_fundamentals', {
  questionCode: 'JNCIA-RT-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the default routing preference for OSPF internal routes in Junos?',
  options: ['A. 5', 'B. 10', 'C. 15', 'D. 150'],
  correctAnswer: 'B',
  explanation: 'In Junos OS, OSPF internal routes have a default preference (equivalent to administrative distance) of 10. OSPF external routes have a preference of 150.',
});

addQ(certIds.jncia, 'JNCIA', 'junos_cli', {
  questionCode: 'JNCIA-CLI-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which command displays the running configuration in Junos?',
  options: ['A. show running-config', 'B. show configuration', 'C. display config', 'D. get config'],
  correctAnswer: 'B',
  explanation: 'In Junos OS, "show configuration" displays the active (committed) configuration. This is different from Cisco\'s "show running-config" command.',
});

// ─── MIKROTIK QUESTIONS ──────────────────────────────────────

addQ(certIds.mikrotik, 'MTCNA', 'routeros_basics', {
  questionCode: 'MT-ROS-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What is the default username for a new MikroTik RouterOS installation?',
  options: ['A. root', 'B. admin', 'C. user', 'D. mikrotik'],
  correctAnswer: 'B',
  explanation: 'The default username for MikroTik RouterOS is "admin" with no password. It is strongly recommended to set a password immediately after first login.',
});

addQ(certIds.mikrotik, 'MTCNA', 'routeros_basics', {
  questionCode: 'MT-ROS-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which MikroTik tool provides a graphical management interface?',
  options: ['A. SSH', 'B. WinBox', 'C. Telnet', 'D. WebFig only'],
  correctAnswer: 'B',
  explanation: 'WinBox is MikroTik\'s native graphical management tool. It can connect via IP address or MAC address. WebFig is the web-based interface, and CLI access is available via SSH/Telnet.',
});

addQ(certIds.mikrotik, 'MTCNA', 'firewall', {
  questionCode: 'MT-FW-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which MikroTik firewall chain processes traffic destined for the router itself?',
  options: ['A. forward', 'B. input', 'C. output', 'D. prerouting'],
  correctAnswer: 'B',
  explanation: 'The "input" chain processes traffic destined for the router itself. "Forward" is for traffic passing through. "Output" is for traffic originating from the router.',
});

addQ(certIds.mikrotik, 'MTCNA', 'dhcp', {
  questionCode: 'MT-DHCP-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'In MikroTik, where do you configure a DHCP server?',
  options: ['A. /ip dhcp-server', 'B. /ip pool', 'C. /ip address', 'D. /system dhcp'],
  correctAnswer: 'A',
  explanation: 'MikroTik DHCP server is configured under /ip dhcp-server. The address pool is configured under /ip pool, and the network settings under /ip dhcp-server network.',
});

// ─── PALO ALTO QUESTIONS ─────────────────────────────────────

addQ(certIds.paloAlto, 'PCNSA', 'ngfw_fundamentals', {
  questionCode: 'PA-NGFW-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What distinguishes a Next-Generation Firewall (NGFW) from a traditional firewall?',
  options: [
    'A. Packet filtering capability',
    'B. Application-level inspection and control',
    'C. Stateful inspection',
    'D. NAT support',
  ],
  correctAnswer: 'B',
  explanation: 'NGFWs go beyond traditional firewalls by providing application-level inspection (App-ID), user identification (User-ID), and content inspection (Content-ID), not just port/protocol filtering.',
});

addQ(certIds.paloAlto, 'PCNSA', 'security_policies', {
  questionCode: 'PA-SEC-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'In Palo Alto Networks, what concept replaces traditional zones with source and destination matching?',
  options: ['A. Interfaces', 'B. Security Zones', 'C. Virtual Routers', 'D. VSYS'],
  correctAnswer: 'B',
  explanation: 'Palo Alto uses Security Zones as the foundation of security policy. Traffic is classified by source and destination zones, and policies control inter-zone and intra-zone traffic.',
});

addQ(certIds.paloAlto, 'PCNSA', 'app_id', {
  questionCode: 'PA-APP-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What Palo Alto technology identifies applications regardless of port, protocol, or encryption?',
  options: ['A. Content-ID', 'B. User-ID', 'C. App-ID', 'D. WildFire'],
  correctAnswer: 'C',
  explanation: 'App-ID is Palo Alto\'s application identification technology. It classifies traffic by application, not just port number, enabling granular security policies based on actual applications.',
});

addQ(certIds.paloAlto, 'PCNSA', 'wildfire', {
  questionCode: 'PA-WF-001',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'What is the primary function of Palo Alto WildFire?',
  options: [
    'A. URL filtering',
    'B. Cloud-based threat analysis and sandboxing',
    'C. VPN termination',
    'D. Load balancing',
  ],
  correctAnswer: 'B',
  explanation: 'WildFire is Palo Alto\'s cloud-based threat analysis service that uses machine learning and sandboxing to detect unknown malware, zero-day exploits, and advanced threats.',
});

// ─── GENERAL NETWORKING QUESTIONS ────────────────────────────

addQ(certIds.generalNetworking, 'GEN', 'osi___tcp_ip', {
  questionCode: 'GEN-OSI-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'How many layers does the TCP/IP model have?',
  options: ['A. 3', 'B. 4', 'C. 5', 'D. 7'],
  correctAnswer: 'B',
  explanation: 'The TCP/IP model has 4 layers: Network Access (Link), Internet, Transport, and Application. The OSI model has 7 layers.',
});

addQ(certIds.generalNetworking, 'GEN', 'ip_addressing', {
  questionCode: 'GEN-IP-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the subnet mask for a /24 network?',
  options: ['A. 255.255.0.0', 'B. 255.255.255.0', 'C. 255.255.255.128', 'D. 255.255.255.192'],
  correctAnswer: 'B',
  explanation: 'A /24 CIDR notation means 24 bits are used for the network portion, resulting in a subnet mask of 255.255.255.0 (11111111.11111111.11111111.00000000).',
});

addQ(certIds.generalNetworking, 'GEN', 'subnetting', {
  questionCode: 'GEN-SUB-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the broadcast address for the network 192.168.1.0/24?',
  options: ['A. 192.168.1.0', 'B. 192.168.1.1', 'C. 192.168.1.254', 'D. 192.168.1.255'],
  correctAnswer: 'D',
  explanation: 'For a /24 network, the broadcast address has all host bits set to 1. For 192.168.1.0/24, the broadcast address is 192.168.1.255.',
});

addQ(certIds.generalNetworking, 'GEN', 'subnetting', {
  questionCode: 'GEN-SUB-002',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'You need to create 14 subnets. What is the minimum number of bits you must borrow from the host portion?',
  options: ['A. 3 bits', 'B. 4 bits', 'C. 5 bits', 'D. 6 bits'],
  correctAnswer: 'B',
  explanation: 'To create 14 subnets: 2^3 = 8 (not enough), 2^4 = 16 (enough). You need to borrow at least 4 bits to create 16 subnets, which accommodates the 14 required.',
});

addQ(certIds.generalNetworking, 'GEN', 'routing_basics', {
  questionCode: 'GEN-RT-001',
  type: 'true_false',
  difficulty: 'easy',
  questionText: 'A default route is represented as 0.0.0.0/0 in a routing table.',
  options: ['A. True', 'B. False'],
  correctAnswer: 'A',
  explanation: 'True. The default route (0.0.0.0/0) matches all destinations and is used as a "gateway of last resort" when no more specific route is found.',
});

addQ(certIds.generalNetworking, 'GEN', 'dns', {
  questionCode: 'GEN-DNS-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which port does DNS typically use?',
  options: ['A. Port 25', 'B. Port 53', 'C. Port 67', 'D. Port 80'],
  correctAnswer: 'B',
  explanation: 'DNS uses UDP port 53 for queries and TCP port 53 for zone transfers and large responses. Port 25 is SMTP, Port 67 is DHCP server, Port 80 is HTTP.',
});

addQ(certIds.generalNetworking, 'GEN', 'network_protocols', {
  questionCode: 'GEN-PROTO-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which protocol is used to send email?',
  options: ['A. POP3', 'B. IMAP', 'C. SMTP', 'D. HTTP'],
  correctAnswer: 'C',
  explanation: 'SMTP (Simple Mail Transfer Protocol, port 25/587) is used to send email. POP3 (port 110) and IMAP (port 143) are used to receive/retrieve email.',
});

addQ(certIds.generalNetworking, 'GEN', 'network_protocols', {
  questionCode: 'GEN-PROTO-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What does ARP resolve?',
  options: [
    'A. IP addresses to domain names',
    'B. Domain names to IP addresses',
    'C. IP addresses to MAC addresses',
    'D. MAC addresses to port numbers',
  ],
  correctAnswer: 'C',
  explanation: 'ARP (Address Resolution Protocol) resolves IP addresses to MAC addresses on a local network segment. This mapping is necessary for Layer 2 frame delivery.',
});

// ─── NETWORK SECURITY QUESTIONS ──────────────────────────────

addQ(certIds.networkSecurity, 'NSEC', 'firewalls', {
  questionCode: 'NSEC-FW-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the difference between a stateful and stateless firewall?',
  options: [
    'A. Stateless firewalls are more secure',
    'B. Stateful firewalls track connection state and context',
    'C. There is no difference',
    'D. Stateless firewalls require more processing power',
  ],
  correctAnswer: 'B',
  explanation: 'Stateful firewalls maintain a state table tracking active connections. They can make decisions based on the context of the entire connection, not just individual packets.',
});

addQ(certIds.networkSecurity, 'NSEC', 'ids_ips', {
  questionCode: 'NSEC-IDS-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the key difference between IDS and IPS?',
  options: [
    'A. IDS prevents attacks, IPS detects attacks',
    'B. IDS detects attacks, IPS prevents attacks',
    'C. They are the same thing',
    'D. IDS works at Layer 2, IPS at Layer 3',
  ],
  correctAnswer: 'B',
  explanation: 'IDS (Intrusion Detection System) monitors and alerts on suspicious activity. IPS (Intrusion Prevention System) actively blocks malicious traffic in real-time.',
});

addQ(certIds.networkSecurity, 'NSEC', 'vpn', {
  questionCode: 'NSEC-VPN-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which protocol combination does IPsec use for encryption and authentication?',
  options: [
    'A. AH and ESP',
    'B. SSL and TLS',
    'C. HTTP and HTTPS',
    'D. TCP and UDP',
  ],
  correctAnswer: 'A',
  explanation: 'IPsec uses AH (Authentication Header) for authentication/integrity and ESP (Encapsulating Security Payload) for encryption, authentication, and integrity. ESP is most commonly used.',
});

addQ(certIds.networkSecurity, 'NSEC', 'encryption', {
  questionCode: 'NSEC-ENC-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What key length does AES-256 use?',
  options: ['A. 128 bits', 'B. 192 bits', 'C. 256 bits', 'D. 512 bits'],
  correctAnswer: 'C',
  explanation: 'AES-256 uses a 256-bit encryption key. AES supports three key lengths: 128, 192, and 256 bits. Longer keys provide stronger encryption but require more processing.',
});

// ─── LINUX NETWORKING QUESTIONS ──────────────────────────────

addQ(certIds.linuxNetworking, 'LNET', 'network_configuration', {
  questionCode: 'LNET-CFG-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which command displays network interface information on modern Linux systems?',
  options: ['A. ifconfig', 'B. ip addr show', 'C. netstat -i', 'D. route'],
  correctAnswer: 'B',
  explanation: '"ip addr show" (or "ip a") is the modern command for displaying network interface information. ifconfig is deprecated (part of net-tools). The "ip" command is part of iproute2.',
});

addQ(certIds.linuxNetworking, 'LNET', 'iptables', {
  questionCode: 'LNET-IPT-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which iptables chain processes packets destined for the local system?',
  options: ['A. FORWARD', 'B. INPUT', 'C. OUTPUT', 'D. PREROUTING'],
  correctAnswer: 'B',
  explanation: 'The INPUT chain processes packets destined for the local system. FORWARD handles packets being routed through. OUTPUT handles locally generated packets. PREROUTING is a nat table chain.',
});

addQ(certIds.linuxNetworking, 'LNET', 'network_troubleshooting', {
  questionCode: 'LNET-TSHOOT-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which Linux command captures and analyzes network packets?',
  options: ['A. netstat', 'B. ss', 'C. tcpdump', 'D. nmap'],
  correctAnswer: 'C',
  explanation: 'tcpdump is a command-line packet analyzer. It captures packets on a network interface and allows filtering and analysis. Wireshark (tshark) is the GUI equivalent.',
});

addQ(certIds.linuxNetworking, 'LNET', 'dns_server', {
  questionCode: 'LNET-DNS-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which file is used to configure DNS resolvers on Linux?',
  options: ['A. /etc/hosts', 'B. /etc/resolv.conf', 'C. /etc/nsswitch.conf', 'D. /etc/named.conf'],
  correctAnswer: 'B',
  explanation: '/etc/resolv.conf specifies DNS name servers and search domains. /etc/hosts provides static hostname-to-IP mappings. /etc/named.conf configures the BIND DNS server.',
});

// ─── CLOUD NETWORKING QUESTIONS ──────────────────────────────

addQ(certIds.cloudNetworking, 'CNET', 'virtual_private_cloud', {
  questionCode: 'CNET-VPC-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is a VPC (Virtual Private Cloud)?',
  options: [
    'A. A physical data center',
    'B. An isolated virtual network in the cloud',
    'C. A VPN connection',
    'D. A content delivery network',
  ],
  correctAnswer: 'B',
  explanation: 'A VPC is a logically isolated virtual network in the cloud that you can define, configure, and manage. It provides network isolation, subnets, route tables, and security groups.',
});

addQ(certIds.cloudNetworking, 'CNET', 'load_balancing', {
  questionCode: 'CNET-LB-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which load balancing algorithm distributes requests equally to each server in turn?',
  options: ['A. Least Connections', 'B. Round Robin', 'C. Weighted Random', 'D. IP Hash'],
  correctAnswer: 'B',
  explanation: 'Round Robin distributes requests sequentially and equally to each server. Least Connections sends to the server with fewest active connections. IP Hash uses the client IP to determine the server.',
});

addQ(certIds.cloudNetworking, 'CNET', 'hybrid_connectivity', {
  questionCode: 'CNET-HC-001',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'What is the most reliable way to connect an on-premises data center to a cloud VPC?',
  options: ['A. Internet VPN', 'B. Direct Connect / ExpressRoute', 'C. SSH tunnel', 'D. Public peering'],
  correctAnswer: 'B',
  explanation: 'Direct Connect (AWS) / ExpressRoute (Azure) / Cloud Interconnect (GCP) provides a dedicated, private network connection to the cloud. It offers more reliability, lower latency, and consistent bandwidth than internet-based VPN.',
});

// ─── MORE SCENARIO & CLI QUESTIONS ───────────────────────────

addQ(certIds.ccna, 'CCNA', 'ospf', {
  questionCode: 'CCNA-OSPF-005',
  type: 'scenario',
  difficulty: 'hard',
  questionText: 'A network engineer notices that two OSPF routers connected via the same Ethernet segment are stuck in the EXSTART/EXCHANGE state. What is the most likely cause?',
  options: [
    'A. Mismatched Hello intervals',
    'B. Mismatched MTU values',
    'C. Mismatched area IDs',
    'D. Mismatched authentication',
  ],
  correctAnswer: 'B',
  explanation: 'When OSPF neighbors are stuck in EXSTART/EXCHANGE, it typically indicates an MTU mismatch. During this state, routers exchange DBD packets, and if the MTU doesn\'t match, the adjacency cannot progress. Mismatched Hello intervals or area IDs would prevent reaching this state.',
});

addQ(certIds.ccna, 'CCNA', 'vlans', {
  questionCode: 'CCNA-VLAN-005',
  type: 'configuration',
  difficulty: 'medium',
  questionText: 'Which set of commands correctly creates VLAN 100 and assigns it to interface GigabitEthernet0/1 as an access port?',
  codeBlock: 'Option A:\nvlan 100\nname SALES\ninterface gi0/1\nswitchport mode access\nswitchport access vlan 100\n\nOption B:\ninterface gi0/1\nvlan 100\nswitchport access\n\nOption C:\nvlan 100\ninterface gi0/1\nswitchport trunk vlan 100\n\nOption D:\ninterface gi0/1\nswitchport access vlan 100',
  options: ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
  correctAnswer: 'A',
  explanation: 'Option A is the complete and correct configuration: create VLAN 100 with a name, then configure the interface as an access port and assign it to VLAN 100. Option D is missing the vlan creation and switchport mode command.',
});

addQ(certIds.ccnp, 'CCNP', 'bgp', {
  questionCode: 'CCNP-BGP-004',
  type: 'cli_output',
  difficulty: 'hard',
  questionText: 'Examine the BGP output below. What is the status of this BGP neighbor?\n\nR1#show ip bgp summary\nNeighbor    V  AS  MsgRcvd  MsgSent  TblVer  InQ OutQ  Up/Down  State/PfxRcd\n10.1.1.2    4  65002  0       0        1       0    0    never    Active',
  options: [
    'A. The BGP session is established',
    'B. The router is actively trying to establish a TCP connection',
    'C. The BGP session is in idle state',
    'D. The router has received routes from this neighbor',
  ],
  correctAnswer: 'B',
  explanation: 'The "Active" state in BGP means the router is actively trying to establish a TCP connection (port 179) with the neighbor but has not succeeded. This could indicate connectivity issues, incorrect neighbor IP, or firewall blocking. The "never" in Up/Down confirms no session has been established.',
});

addQ(certIds.ccna, 'CCNA', 'routing_concepts', {
  questionCode: 'CCNA-RT-004',
  type: 'topology',
  difficulty: 'hard',
  questionText: 'Consider the following network topology:\n\nPC1 (192.168.1.10) → SW1 → R1 → R2 → SW2 → Server (10.10.20.5)\n\nR1 has the following routes:\n- 10.10.20.0/24 via 10.1.1.2 (OSPF)\n- 10.10.20.0/24 via 10.2.2.2 (Static)\n\nWhich route will R1 use to reach the server?',
  topologyData: {
    nodes: ['PC1', 'SW1', 'R1', 'R2', 'SW2', 'Server'],
    connections: [
      { from: 'PC1', to: 'SW1' },
      { from: 'SW1', to: 'R1' },
      { from: 'R1', to: 'R2' },
      { from: 'R2', to: 'SW2' },
      { from: 'SW2', to: 'Server' },
    ],
  },
  options: [
    'A. OSPF route via 10.1.1.2 (AD 110)',
    'B. Static route via 10.2.2.2 (AD 1)',
    'C. Both routes (load balancing)',
    'D. Neither route (destination unreachable)',
  ],
  correctAnswer: 'B',
  explanation: 'The static route will be preferred because it has a lower administrative distance (AD=1) compared to OSPF (AD=110). The router always selects the route with the lowest AD.',
});

addQ(certIds.securityPlus, 'SEC+', 'incident_response', {
  questionCode: 'SEC-IR-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the correct order of the incident response process?',
  options: [
    'A. Detection, Containment, Eradication, Recovery, Lessons Learned',
    'B. Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned',
    'C. Containment, Detection, Eradication, Recovery, Preparation',
    'D. Detection, Preparation, Recovery, Containment, Lessons Learned',
  ],
  correctAnswer: 'B',
  explanation: 'The NIST incident response lifecycle: 1) Preparation, 2) Detection & Analysis, 3) Containment, Eradication & Recovery, 4) Post-Incident Activity (Lessons Learned).',
});

// Additional questions to reach 200+
addQ(certIds.networkPlus, 'NET+', 'network_services', {
  questionCode: 'NET-SVC-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'Which protocol is used to securely transfer files over a network?',
  options: ['A. FTP', 'B. SFTP', 'C. TFTP', 'D. HTTP'],
  correctAnswer: 'B',
  explanation: 'SFTP (SSH File Transfer Protocol) provides secure file transfer using SSH encryption. FTP sends data in plaintext. TFTP is a simplified, unsecured file transfer protocol.',
});

addQ(certIds.networkPlus, 'NET+', 'network_services', {
  questionCode: 'NET-SVC-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the purpose of SNMP in network management?',
  options: [
    'A. Email delivery',
    'B. File transfer',
    'C. Monitoring and managing network devices',
    'D. DNS resolution',
  ],
  correctAnswer: 'C',
  explanation: 'SNMP (Simple Network Management Protocol) is used to monitor and manage network devices. It uses agents on devices to collect data and a manager to query/configure devices. Uses UDP ports 161/162.',
});

addQ(certIds.generalNetworking, 'GEN', 'switching_basics', {
  questionCode: 'GEN-SW-001',
  type: 'multiple_choice',
  difficulty: 'easy',
  questionText: 'What does a network switch use to make forwarding decisions?',
  options: ['A. IP addresses', 'B. MAC addresses', 'C. Port numbers', 'D. Hostnames'],
  correctAnswer: 'B',
  explanation: 'Layer 2 switches use MAC (Media Access Control) addresses to make forwarding decisions. They build a MAC address table by learning source MAC addresses from incoming frames.',
});

addQ(certIds.generalNetworking, 'GEN', 'switching_basics', {
  questionCode: 'GEN-SW-002',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What happens when a switch receives a frame with an unknown destination MAC address?',
  options: [
    'A. The frame is dropped',
    'B. The frame is sent to the default gateway',
    'C. The frame is flooded out all ports except the incoming port',
    'D. The frame is cached for later delivery',
  ],
  correctAnswer: 'C',
  explanation: 'When a switch receives a frame with an unknown destination MAC, it floods the frame out all ports except the one it was received on. This is called "unknown unicast flooding".',
});

addQ(certIds.networkSecurity, 'NSEC', 'pki', {
  questionCode: 'NSEC-PKI-001',
  type: 'multiple_choice',
  difficulty: 'hard',
  questionText: 'What is the purpose of a Certificate Authority (CA) in PKI?',
  options: [
    'A. To encrypt all network traffic',
    'B. To issue, manage, and revoke digital certificates',
    'C. To store user passwords',
    'D. To provide DNS services',
  ],
  correctAnswer: 'B',
  explanation: 'A Certificate Authority (CA) is a trusted entity that issues, manages, and revokes digital certificates. The CA vouches for the identity of certificate holders, enabling trust in public key cryptography.',
});

addQ(certIds.networkSecurity, 'NSEC', 'access_control', {
  questionCode: 'NSEC-AC-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the principle of least privilege?',
  options: [
    'A. All users should have administrator access',
    'B. Users should only have the minimum access needed to perform their job',
    'C. Access should be granted based on seniority',
    'D. All data should be encrypted',
  ],
  correctAnswer: 'B',
  explanation: 'The principle of least privilege states that users should be granted only the minimum level of access (or permissions) necessary to perform their job functions. This minimizes the attack surface.',
});

addQ(certIds.networkSecurity, 'NSEC', 'security_best_practices', {
  questionCode: 'NSEC-BP-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is network segmentation and why is it important?',
  options: [
    'A. Dividing a network into segments to improve performance and security',
    'B. Connecting all devices to a single network',
    'C. Removing firewalls from the network',
    'D. Using only wireless connections',
  ],
  correctAnswer: 'A',
  explanation: 'Network segmentation divides a network into smaller, isolated segments. This limits the blast radius of security breaches, improves performance, and enables granular access control.',
});

addQ(certIds.cloudNetworking, 'CNET', 'cdn', {
  questionCode: 'CNET-CDN-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the primary purpose of a CDN (Content Delivery Network)?',
  options: [
    'A. To store databases',
    'B. To deliver content from geographically distributed edge servers close to users',
    'C. To provide email services',
    'D. To manage DNS records',
  ],
  correctAnswer: 'B',
  explanation: 'A CDN distributes content across geographically dispersed edge servers, serving content from the nearest location to the user. This reduces latency, improves load times, and provides redundancy.',
});

addQ(certIds.cloudNetworking, 'CNET', 'dns_in_cloud', {
  questionCode: 'CNET-DNS-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What is the advantage of using cloud-based DNS services like Route 53 or Cloud DNS?',
  options: [
    'A. Lower cost only',
    'B. Global anycast network, high availability, and low latency',
    'C. They only work with one cloud provider',
    'D. They replace all local DNS servers',
  ],
  correctAnswer: 'B',
  explanation: 'Cloud DNS services provide global anycast networks, 100% SLA availability, low latency DNS resolution, health checks, and advanced routing policies (latency-based, geolocation, failover).',
});

addQ(certIds.linuxNetworking, 'LNET', 'routing_on_linux', {
  questionCode: 'LNET-RT-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which command adds a static route on modern Linux systems?',
  options: [
    'A. route add -net 10.0.0.0/8 gw 192.168.1.1',
    'B. ip route add 10.0.0.0/8 via 192.168.1.1',
    'C. netstat -r add 10.0.0.0/8',
    'D. ifconfig route 10.0.0.0/8',
  ],
  correctAnswer: 'B',
  explanation: '"ip route add" is the modern command for adding static routes on Linux (iproute2 package). The "route" command is deprecated. The syntax specifies the destination network and gateway.',
});

addQ(certIds.linuxNetworking, 'LNET', 'dhcp_server', {
  questionCode: 'LNET-DHCP-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'Which service provides DHCP server functionality on Linux?',
  options: ['A. dhcpd (ISC DHCP)', 'B. httpd', 'C. sshd', 'D. ftpd'],
  correctAnswer: 'A',
  explanation: 'ISC DHCP (dhcpd) is the most common DHCP server on Linux. It is configured via /etc/dhcp/dhcpd.conf. Alternatives include dnsmasq (lightweight DNS+DHCP) and Kea DHCP.',
});

addQ(certIds.mikrotik, 'MTCNA', 'routing', {
  questionCode: 'MT-RT-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'How do you add a default route in MikroTik RouterOS?',
  options: [
    'A. /ip route add dst-address=0.0.0.0/0 gateway=10.0.0.1',
    'B. /ip default-route 10.0.0.1',
    'C. /routing add default 10.0.0.1',
    'D. /ip gateway 10.0.0.1',
  ],
  correctAnswer: 'A',
  explanation: 'In MikroTik RouterOS, a default route is added with "/ip route add dst-address=0.0.0.0/0 gateway=<gateway-ip>". The 0.0.0.0/0 represents the default route matching all destinations.',
});

addQ(certIds.jncia, 'JNCIA', 'switching', {
  questionCode: 'JNCIA-SW-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'In Junos, what is a routing instance used for?',
  options: [
    'A. To create VLANs',
    'B. To create separate routing tables for traffic isolation',
    'C. To configure interfaces',
    'D. To manage users',
  ],
  correctAnswer: 'B',
  explanation: 'Routing instances in Junos create separate routing tables, enabling VRF (Virtual Routing and Forwarding). This isolates traffic between different customers or network segments.',
});

addQ(certIds.jncia, 'JNCIA', 'junos_security', {
  questionCode: 'JNCIA-SEC-001',
  type: 'multiple_choice',
  difficulty: 'medium',
  questionText: 'What Junos feature provides stateful firewall inspection on SRX devices?',
  options: ['A. Firewall filters', 'B. Security policies', 'C. ACLs', 'D. Route filters'],
  correctAnswer: 'B',
  explanation: 'Junos SRX devices use security policies for stateful firewall inspection. They control traffic between security zones based on source, destination, application, and user.',
});

const achievements = [
  { id: uuidv4(), name: 'First Test', description: 'Complete your first practice test', icon: '🏆', criteria: { testsCompleted: 1 }, category: 'milestone' },
  { id: uuidv4(), name: '7 Day Streak', description: 'Complete tests for 7 consecutive days', icon: '🔥', criteria: { streak: 7 }, category: 'streak' },
  { id: uuidv4(), name: 'Perfect Score', description: 'Score 100% on any test', icon: '💯', criteria: { perfectScore: true }, category: 'score' },
  { id: uuidv4(), name: '90% Club', description: 'Score 90% or higher on a test', icon: '🎯', criteria: { minScore: 90 }, category: 'score' },
  { id: uuidv4(), name: 'Speed Demon', description: 'Complete a 50-question test in under 20 minutes', icon: '⚡', criteria: { speedTest: true }, category: 'speed' },
  { id: uuidv4(), name: '100 Questions', description: 'Answer 100 questions total', icon: '📚', criteria: { questionsAnswered: 100 }, category: 'milestone' },
  { id: uuidv4(), name: '500 Questions', description: 'Answer 500 questions total', icon: '📖', criteria: { questionsAnswered: 500 }, category: 'milestone' },
  { id: uuidv4(), name: '1000 Questions', description: 'Answer 1000 questions total', icon: '🎓', criteria: { questionsAnswered: 1000 }, category: 'milestone' },
  { id: uuidv4(), name: 'Networking Master', description: 'Complete tests in 5 different certifications', icon: '🌐', criteria: { differentCerts: 5 }, category: 'diversity' },
  { id: uuidv4(), name: 'Security Expert', description: 'Score 90%+ on a Security+ test', icon: '🔐', criteria: { certScore: { cert: 'SEC+', minScore: 90 } }, category: 'certification' },
  { id: uuidv4(), name: 'CCNA Ready', description: 'Score 85%+ on a CCNA test', icon: '🏅', criteria: { certScore: { cert: 'CCNA', minScore: 85 } }, category: 'certification' },
  { id: uuidv4(), name: 'Test Marathon', description: 'Complete 10 tests in a single day', icon: '🏃', criteria: { testsInDay: 10 }, category: 'dedication' },
  { id: uuidv4(), name: 'Night Owl', description: 'Complete a test after midnight', icon: '🦉', criteria: { nightTest: true }, category: 'fun' },
  { id: uuidv4(), name: 'Early Bird', description: 'Complete a test before 6 AM', icon: '🐦', criteria: { earlyTest: true }, category: 'fun' },
  { id: uuidv4(), name: 'Comeback Kid', description: 'Score 90%+ after previously scoring below 50%', icon: '💪', criteria: { comeback: true }, category: 'improvement' },
];

module.exports = { certifications, topics, questions, achievements };
