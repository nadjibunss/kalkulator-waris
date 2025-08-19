document.getElementById('calculate-btn').addEventListener('click', function() {
    // Get input values
    const totalWealth = parseFloat(document.getElementById('total-wealth').value) || 0;
    const gender = document.getElementById('gender').value;
    
    const hasHusband = document.getElementById('husband').value === '1';
    const wifeCount = parseInt(document.getElementById('wife').value) || 0;
    const hasFather = document.getElementById('father').value === '1';
    const hasMother = document.getElementById('mother').value === '1';
    
    const maleChildren = parseInt(document.getElementById('male-children').value) || 0;
    const femaleChildren = parseInt(document.getElementById('female-children').value) || 0;
    
    const maleGrandchildren = parseInt(document.getElementById('male-grandchildren').value) || 0;
    const femaleGrandchildren = parseInt(document.getElementById('female-grandchildren').value) || 0;
    
    const maleSiblings = parseInt(document.getElementById('male-siblings').value) || 0;
    const femaleSiblings = parseInt(document.getElementById('female-siblings').value) || 0;
    
    // Calculate heirs shares
    const heirs = {};
    let remainingWealth = totalWealth;
    
    // Husband's share
    if (hasHusband) {
        let husbandsShare;
        if (maleChildren > 0 || femaleChildren > 0 || maleGrandchildren > 0 || femaleGrandchildren > 0) {
            husbandsShare = totalWealth * 1/4;
        } else {
            husbandsShare = totalWealth * 1/2;
        }
        heirs['Suami'] = husbandsShare;
        remainingWealth -= husbandsShare;
    }
    
    // Wife's share
    if (wifeCount > 0) {
        let wivesShare;
        if (maleChildren > 0 || femaleChildren > 0 || maleGrandchildren > 0 || femaleGrandchildren > 0) {
            wivesShare = totalWealth * 1/8;
        } else {
            wivesShare = totalWealth * 1/4;
        }
        wivesShare *= wifeCount;
        heirs[`Istri (${wifeCount})`] = wivesShare;
        remainingWealth -= wivesShare;
    }
    
    // Father's share
    if (hasFather) {
        let fathersShare;
        if (maleChildren > 0 || femaleChildren > 0 || maleGrandchildren > 0 || femaleGrandchildren > 0) {
            fathersShare = totalWealth * 1/6;
        } else {
            fathersShare = totalWealth * 1/4;
        }
        heirs['Ayah'] = fathersShare;
        remainingWealth -= fathersShare;
    }
    
    // Mother's share
    if (hasMother) {
        let mothersShare;
        if (maleChildren > 0 || femaleChildren > 0 || maleGrandchildren > 0 || femaleGrandchildren > 0) {
            if (maleSiblings > 0 || femaleSiblings > 0) {
                mothersShare = totalWealth * 1/6;
            } else {
                mothersShare = totalWealth * 1/3;
            }
        } else {
            if (maleSiblings > 0 || femaleSiblings > 0) {
                mothersShare = totalWealth * 1/6;
            } else {
                mothersShare = totalWealth * 1/3;
            }
        }
        heirs['Ibu'] = mothersShare;
        remainingWealth -= mothersShare;
    }
    
    // Children's share
    if (maleChildren > 0 || femaleChildren > 0) {
        if (maleChildren > 0 && femaleChildren > 0) {
            // If both male and female children, male gets 2 parts, female gets 1 part
            const totalParts = (maleChildren * 2) + femaleChildren;
            const maleShare = (totalWealth * 2/3) * (maleChildren * 2) / totalParts;
            const femaleShare = (totalWealth * 2/3) * femaleChildren / totalParts;
            
            if (maleChildren > 0) {
                heirs[`Anak Laki-laki (${maleChildren})`] = maleShare;
                remainingWealth -= maleShare;
            }
            
            if (femaleChildren > 0) {
                heirs[`Anak Perempuan (${femaleChildren})`] = femaleShare;
                remainingWealth -= femaleShare;
            }
        } else if (maleChildren > 0) {
            // Only male children
            const childrenShare = totalWealth;
            heirs[`Anak Laki-laki (${maleChildren})`] = childrenShare;
            remainingWealth -= childrenShare;
        } else {
            // Only female children
            const childrenShare = totalWealth;
            heirs[`Anak Perempuan (${femaleChildren})`] = childrenShare;
            remainingWealth -= childrenShare;
        }
    } else if (maleGrandchildren > 0 || femaleGrandchildren > 0) {
        // If no children but there are grandchildren
        if (gender === 'male') {
            // Grandchildren inherit as children if the deceased is male
            if (maleGrandchildren > 0 && femaleGrandchildren > 0) {
                const totalParts = (maleGrandchildren * 2) + femaleGrandchildren;
                const maleShare = (totalWealth * 2/3) * (maleGrandchildren * 2) / totalParts;
                const femaleShare = (totalWealth * 2/3) * femaleGrandchildren / totalParts;
                
                if (maleGrandchildren > 0) {
                    heirs[`Cucu Laki-laki (${maleGrandchildren})`] = maleShare;
                    remainingWealth -= maleShare;
                }
                
                if (femaleGrandchildren > 0) {
                    heirs[`Cucu Perempuan (${femaleGrandchildren})`] = femaleShare;
                    remainingWealth -= femaleShare;
                }
            } else if (maleGrandchildren > 0) {
                // Only male grandchildren
                const grandchildrenShare = totalWealth;
                heirs[`Cucu Laki-laki (${maleGrandchildren})`] = grandchildrenShare;
                remainingWealth -= grandchildrenShare;
            } else {
                // Only female grandchildren
                const grandchildrenShare = totalWealth;
                heirs[`Cucu Perempuan (${femaleGrandchildren})`] = grandchildrenShare;
                remainingWealth -= grandchildrenShare;
            }
        }
    }
    
    // Siblings' share
    if (maleSiblings > 0 || femaleSiblings > 0) {
        if (maleChildren > 0 || femaleChildren > 0 || maleGrandchildren > 0 || femaleGrandchildren > 0) {
            // If there are children or grandchildren, siblings don't inherit
        } else {
            // If no children or grandchildren, siblings may inherit
            if (maleSiblings > 0 && femaleSiblings > 0) {
                // If both male and female siblings, male gets 2 parts, female gets 1 part
                const totalParts = (maleSiblings * 2) + femaleSiblings;
                const maleShare = totalWealth * (maleSiblings * 2) / totalParts;
                const femaleShare = totalWealth * femaleSiblings / totalParts;
                
                if (maleSiblings > 0) {
                    heirs[`Saudara Laki-laki (${maleSiblings})`] = maleShare;
                    remainingWealth -= maleShare;
                }
                
                if (femaleSiblings > 0) {
                    heirs[`Saudara Perempuan (${femaleSiblings})`] = femaleShare;
                    remainingWealth -= femaleShare;
                }
            } else if (maleSiblings > 0) {
                // Only male siblings
                const siblingsShare = totalWealth;
                heirs[`Saudara Laki-laki (${maleSiblings})`] = siblingsShare;
                remainingWealth -= siblingsShare;
            } else {
                // Only female siblings
                const siblingsShare = totalWealth;
                heirs[`Saudara Perempuan (${femaleSiblings})`] = siblingsShare;
                remainingWealth -= siblingsShare;
            }
        }
    }
    
    // Display results
    displayResults(heirs, totalWealth, remainingWealth);
});

function displayResults(heirs, totalWealth, remainingWealth) {
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';
    
    // Add total wealth
    const totalWealthItem = document.createElement('div');
    totalWealthItem.className = 'result-item';
    totalWealthItem.innerHTML = `
        <span class="result-label">Total Harta:</span>
        <span class="result-value">Rp ${formatMoney(totalWealth)}</span>
    `;
    resultContainer.appendChild(totalWealthItem);
    
    // Add each heir's share
    for (const [heir, share] of Object.entries(heirs)) {
        const heirItem = document.createElement('div');
        heirItem.className = 'result-item';
        heirItem.innerHTML = `
            <span class="result-label">${heir}:</span>
            <span class="result-value">Rp ${formatMoney(share)}</span>
        `;
        resultContainer.appendChild(heirItem);
    }
    
    // Add remaining wealth if any
    if (remainingWealth > 0) {
        const remainingItem = document.createElement('div');
        remainingItem.className = 'result-item';
        remainingItem.innerHTML = `
            <span class="result-label">Sisa Harta:</span>
            <span class="result-value">Rp ${formatMoney(remainingWealth)}</span>
        `;
        resultContainer.appendChild(remainingItem);
    }
}

function formatMoney(amount) {
    return amount.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
