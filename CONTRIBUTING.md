# Rules for contributing in IWDŻ development
1. Pick an issue
2. Create a branch using the rules below
3. Test your code and search for possible connected issues (if there are any because of your code - fix them)
4. Commit your code using the rules below
5. Push your branch to the repo
6. Open a PR using the rules below
7. Wait for approval (Applies to Owners too most of the time - for double checks)
8. Merge

### Branch naming format
```
<type>/<purpose-of-the-branch>
Example:
fix/remove-town-hall-delete-option
```

### Commit message format
```
<type>: <short description>
Example:
fix: remove delete option from town hall UI
```

### Pull Request format
#### Title
```
<What changed>
Example:
Made the delete building option not appear for town hall in the building details UI
```
#### Description format
```
## What changed?
Example:
Made every person connected to a workplace and a residence and added relocations if possible

## Why?
Example:
Deleting buildings in different orders produced different final total population results

## Testing
- Created and populated multiple buildings
- Deleted some in a certain order
- Created a new game and did the same but with a different deleting order
- Verified the final population is the same in both cases
```
#### Description for fixing bugs
```
## Cause
Example:
The algorithm that was supposed to search for the building with the lowest income searched for the building with the highest income

## Testing
Example:
1. Build skyscraper and penthouse
2. Populate them
3. Delete the penthouse
4. Verify the algorithm searching for the right building
```
#### Issue connections
```
## Related issues
Closes <issue number>
Example:
Closes #42
```
