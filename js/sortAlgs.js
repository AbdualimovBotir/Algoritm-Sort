
function bubbleSort(arr) {
    let animations = [];
    for(let i =0; i<arr.length; i++){
        for(let j=0; j<arr.length-i-1; j++){
            if(arr[j] > arr[j+1]){
                swap(arr, j, j+1);
                animations.push([arr.slice(0), j+1]); 
            }
        }
    }        
    return animations;
}



function selectionSort(arr){

    let animations = [];
    for(let i=0; i<arr.length-1; i++){
        let minimum = i;
        for(let j = i+1, counter=0; j<arr.length; j++, counter++){
            animations.push([arr.slice(0), j, minimum]);
            if(arr[j] < arr[minimum]){
                minimum = j; 
                animations.push([arr.slice(0), j, minimum]);
            }
        }

        swap(arr, i, minimum);
        animations.push([arr.slice(0), minimum, i]);
    }

    return animations
}



function insertionSort(arr){

    let animations = [];

    for(let i=0; i<arr.length; i++){
        let temp = arr[i],
            pos = i

        while(pos>0 && temp<arr[pos-1]){
            arr[pos] = arr[pos-1];
            animations.push([arr.slice(0), pos-1, i]);
            pos--;
        }
        
        arr[pos] = temp;
        animations.push([arr.slice(0),pos, i]);
    }

    return animations;
}



function animateQuickSort(arr){

    let animations = [];

    quickSort(arr, 0, arr.length - 1, animations);

    return animations;

}

function quickSort(arr, start, end, animations){
    if(start >= end){
        return;
    }

    let pivotIndex = partition(arr, start, end, animations);
    quickSort(arr, start, pivotIndex-1, animations);
    quickSort(arr, pivotIndex+1, end, animations);
}

function partition(arr, start, end, animations){

    let pivotValue = arr[end],
        i = start;

    for(let j=start; j<end; j++){
        animations.push([arr.slice(0), j, end, i]);
        if(arr[j] < pivotValue){
            animations.push([arr.slice(0), j, end, i]);
            swap(arr, j, i);
            animations.push([arr.slice(0), j, end, i]);
            i++
        }     
    }
    
    swap(arr, i, end);
    animations.push([arr.slice(0), i, null, end]);
    
    return i; 
}



function animateMergeSort(arr) {
    let animations = [];
    mergeSort(arr, 0, arr.length - 1, animations);

    return animations
}

function mergeSort(arr, start, end, animations){
    
    if(start>=end){
        return;
    }

    const mid = Math.floor((start+end)/2);

    mergeSort(arr, start, mid, animations);
    mergeSort(arr, mid+1, end, animations);
    merge(arr, start, mid, end, animations);
}

function merge(arr, start, mid, end, animations) {
    let arr1Index = start,
        arr2Index = mid +1,
        tempArr = [],
        colors = [];

    for(let i = start; i<=end; i++){
        if(arr1Index > mid){
            tempArr.push(arr[arr2Index]);
            colors.push([arr2Index, mid])
            arr2Index++;
        }
        else if(arr2Index > end){
            tempArr.push(arr[arr1Index]);
            colors.push([arr1Index, end])
            arr1Index++;
        }
        else if(arr[arr1Index] < arr[arr2Index]){
            tempArr.push(arr[arr1Index]);
            colors.push([arr1Index, arr2Index])
            arr1Index++;
        }
        else{
            tempArr.push(arr[arr2Index]);
            colors.push([arr2Index, arr1Index])
            arr2Index++;
        }
    }

    for(let i = 0; i<tempArr.length;i++){
        arr[start] = tempArr[i];
        animations.push([arr.slice(0), colors[i][0], null, colors[i][1]]);
        start++;
    }
}



function beadSort(arr){
    
    let animations = [];
    
    let beadMatrix = numberToBead(arr);
        
    for(let i = Math.min(...arr); i<beadMatrix.length;i++){
        let counter = 0;
        for(let j=0; j<beadMatrix.length; j++){
            if(beadMatrix[i][j]===false){
                beadMatrix[i][j] = true;
                counter++;
            }
        }

        for(let k=0; k<counter; k++){
            beadMatrix[i][k] = false;
        }

        animations.push([beadToNumber(beadMatrix)]);
    }
    
    return animations;

}

function numberToBead(arr){
    let largest = Math.max(...arr),
        numInBeads = [],
        beadMatrix = [];
    
    for(let i=0; i< arr.length; i++){

        let beads = new Array(largest);   
        beads.fill(true, 0,arr[i]);
        beads.fill(false, arr[i],largest);

        numInBeads.push(beads);
    }

    for(let i=0; i<largest;i++){
        let beads = [];
        for(let j=0; j<numInBeads.length; j++){
            beads.push(numInBeads[j][i]);
        }
        beadMatrix.push(beads);
    }

    return beadMatrix;
}

function beadToNumber(beadMatrix){
    let size = beadMatrix[0].length,
        numbers = [];
    for(let i=0; i<size; i++){
        let counter = 0;
        for(let j=0; j<beadMatrix.length;j++){
            if(beadMatrix[j][i]===true){
                counter++;
            }
        }
        numbers.push(counter);
    }

    return numbers;
}




function heapSort(arr){
        
    let animations = [],
        n = arr.length;

    for(let i = Math.floor(n/2)-1; i>=0;i--){
        heapify(arr, n, i, animations);
    }

    for(let j = n-1; j>=0; j--){
        animations.push([arr.slice(0), j]);
        swap(arr, j, 0);
        animations.push([arr.slice(0), j, 0]);
        heapify(arr, j, 0, animations);
    }

    return animations;
}

function heapify(arr, n, i, animations){
    let largest = i,
        left = 2*i+1,
        right = 2*i+2;
    
    if(left<n && arr[left]>arr[largest]){
        largest = left;
    }

    if(right<n && arr[right]>arr[largest]){
        largest = right;
    }

    if(largest !== i){
        animations.push([arr.slice(0), i, largest]);
        swap(arr, i, largest);
        animations.push([arr.slice(0), i, largest]);
        heapify(arr, n, largest, animations);
    }
}



function radixSort(arr){
    let maxNum = Math.max(...arr),
        divisor = 1,
        animations = [];
       
    while (Math.trunc(maxNum)>0){
        let buckets = [...Array(10)].map(() => []),
            tempDiv = divisor;
        arr.forEach(num=>{
            buckets[Math.floor((num/tempDiv))%10].push(num);
        });

        let temp = arr.slice(0);

        arr = [].concat(...buckets);
        for(let i = 0; i<arr.length; i++){
            temp = arr.slice(0,i+1).concat(...temp.slice(i+1));
            animations.push([temp]);
        }
        

        maxNum/=10;
        divisor *= 10;
        
    }

    return animations;
}



function swap(arr, i, j){
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
