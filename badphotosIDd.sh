find .  -name '*.jpg' | while read FILE; do
if ! identify "$FILE" &> /dev/null; then
        echo "$FILE"
    fi  
done

