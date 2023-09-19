
function increaseDimension(arr, groupSize) {
    let result = [];
    for (let i = 0; i < arr.length; i += groupSize) {
        result.push(arr.slice(i, i + groupSize));
    }
    return result;
}

function listsAreEqual(list1, list2) {
    if (list1.length !== list2.length) {
        return false;
    }

    for (let i = 0; i < list1.length; i++) {
        if (list1[i] !== list2[i]) {
            return false;
        }
    }
    return true;
}

function searchSameResultTeam(teamId, group, results, matchNum){
    let teamResult = [];
    for (let i=0; i<matchNum; i+=1){
        teamResult.push(results[i][teamId]);
    }

    for (let i=0; i<group.length; i+=1){
        const oppTeam = group[i];
        if (teamId == oppTeam){
            continue;
        }
        let oppTeamResult = [];
        for (let j=0; j<matchNum; j+=1){
            oppTeamResult.push(results[j][oppTeam]);
        }
        if (listsAreEqual(teamResult, oppTeamResult)){
            return oppTeam;
        }
    }
    return -1;
}

function getMatchups(results) {
    // 予め決まっているドロー
    const initialOrder = [0, 15, 7, 8, 3, 12, 4, 11, 1, 14, 6, 9, 2, 13, 5, 10];
    let matchups = [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ];
    let roundGroup = [];

    let getMatchLength = 0;
    for (let i=0; i < results.length; i+=1){
        if (results[i].length > 0){
            getMatchLength += 1;
        }
    }

    for (let matchNum = 1; matchNum <= getMatchLength+1; matchNum += 1){
        roundGroup = increaseDimension(initialOrder, 2**matchNum);
        for(let i = 0; i < roundGroup.length; i += 1){
            for (let j = 0; j < roundGroup[0].length; j += 1){
                const group = roundGroup[i];
                const teamId = roundGroup[i][j];
                matchups[matchNum-1][roundGroup[i][j]] = searchSameResultTeam(teamId, group, results, matchNum-1);
            }
        }
    }

    return matchups;
}
